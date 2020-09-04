#!/usr/bin/env python3

import argparse
import sys
from os.path import dirname
from copy import copy

try:
  from rosidl_adapter.parser import (
    MessageSpecification,
    parse_message_file,
    parse_service_file,
  )
except ImportError:
  sys.exit(
    'Unable to import rosidl_adapter. '
    'Please source a ROS2 installation first.'
  )

__MSG_DIR = 'msg'

__dir__ = dirname(__file__)


# These types does not need a 'new' keyword
PRIMITIVE_TYPES = {
  'bool': 'boolean',
  'byte': 'number',
  'char': 'string',
  'float32': 'number',
  'float64': 'number',
  'int8': 'number',
  'int16': 'number',
  'int32': 'number',
  'int64': 'number',
  'string': 'string',
  'wstring': 'string',
  'uint8': 'number',
  'uint16': 'number',
  'uint32': 'number',
  'uint64': 'number',
}

PRIMITIVE_JS_TYPES = [
  'string',
  'boolean',
  'number',
]

PRIMITIVE_TYPES_DEFAULT_VALUES = {
  'bool': 'false',
  'byte': '0',
  'char': "''",
  'float32': '0',
  'float64': '0',
  'int8': '0',
  'int16': '0',
  'int32': '0',
  'int64': '0',
  'string': "''",
  'wstring': "''",
  'uint8': '0',
  'uint16': '0',
  'uint32': '0',
  'uint64': '0',
}

PRIMITIVE_ARRAY_TYPES = {
  'byte': 'Uint8Array',
  'float32': 'Float32Array',
  'float64': 'Float64Array',
  'int8': 'Int8Array',
  'int16': 'Int16Array',
  'int32': 'Int32Array',
  'int64': 'BigInt64Array',
  'uint8': 'Uint8Array',
  'uint16': 'Uint16Array',
  'uint32': 'Uint32Array',
  'uint64': 'BigUint64Array',
}

class JsType():
  def __init__(self, ros_type):
    self.is_primitive = False
    self.is_typed_array = False
    self.is_array = False
    if hasattr(ros_type, 'is_array') and ros_type.is_array:
      self.is_primitive = False
      self.type = PRIMITIVE_ARRAY_TYPES.get(ros_type.type)
      if self.type is None:
        self.type = f'{ros_type.type}[]'
        self.is_array = True
        ros_element_type = copy(ros_type)
        ros_element_type.is_array = False
        self.element_type = JsType(ros_element_type)
      else:
        self.is_typed_array = True
    else:
      self.type = PRIMITIVE_TYPES.get(ros_type.type)
      if self.type is None:
        self.type = ros_type.type
      else:
        self.is_primitive = self.type in PRIMITIVE_JS_TYPES


__model_spec = {}
__parsed_msgs = {}
__parsed_srvs = {}


def __msgspec_to_parsed_type(self, field_name):
  field = None
  for f in self.fields:
    if field_name == f.name:
      field = f
      break

  if not field:
    return None

  spec = __model_spec.get(str(self.base_type))

  if spec:
    spec = spec.get('fields').get(field_name)

  type_string = field.type.type

  if field.type.is_array:
    if type_string in PRIMITIVE_ARRAY_TYPES:
      return PRIMITIVE_ARRAY_TYPES[type_string]

    immutable_type = 'List'
    immutable_map_key = None

    if spec:
      immutable_type = spec['immutableType']
      immutable_map_key = spec.get('immutableMapKey')

    # Definitely is not a primitive type
    if immutable_map_key:
      return f"{immutable_type}<I{type_string}['{immutable_map_key}'], {type_string}Record>"

    if not field.type.is_primitive_type():
      return f'{immutable_type}<{type_string}Record>'

    return f'{immutable_type}<{__PRIMITIVE_TYPES[type_string]}>'

  if field.type.is_primitive_type():
    return PRIMITIVE_TYPES[type_string]

  return f'{type_string}Record'


MessageSpecification.parsed_type = __msgspec_to_parsed_type


def __msgspec_to_default_value(self, field_name):
  field = None
  for f in self.fields:
    if field_name == f.name:
      field = f
      break

  if not field:
    return None

  spec = __model_spec.get(str(self.base_type))

  if spec:
    spec = spec.get('fields').get(field_name)

  type_string = field.type.type

  if field.type.is_array:
    if type_string in PRIMITIVE_ARRAY_TYPES:
      return f'new {__PRIMITIVE_ARRAY_TYPES[type_string]}()'

    immutable_type = 'List'
    if spec:
      immutable_type = spec['immutableType']

    return f'{immutable_type}()'

  if field.type.is_primitive_type():
    return PRIMITIVE_TYPES_DEFAULT_VALUES[type_string]

  return f'{type_string}Record()'


MessageSpecification.default_value = __msgspec_to_default_value


def __msgspec_primitive_fields(self):
  ret = []
  for field in self.fields:
    if field.type.is_primitive_type():
      ret.append(field)

  return ret


MessageSpecification.primitive_fields = __msgspec_primitive_fields


def __msgspec_non_primitive_fields(self):
  ret = []
  for field in self.fields:
    if not field.type.is_primitive_type():
      ret.append(field)

  return ret


MessageSpecification.non_primitive_fields = __msgspec_non_primitive_fields


def __msgspec_dependent_types(self):
  types = {
    (field.type.pkg_name, field.type.type): field.type for field in self.non_primitive_fields()
  }
  return types.values()


MessageSpecification.dependent_types = __msgspec_dependent_types


def __msgspec_parse_enums(self):
  self.enums = {}
  if not self.constants:
    return

  for constant in self.constants:
    for primitive_field in self.primitive_fields():
      prefix = primitive_field.name.upper()
      if constant.name.startswith(prefix):
        enum_name = ''.join(
          [s.capitalize() for s in prefix.split('_')]
        )
        enum_field = constant.name.replace(f'{prefix}_', '')

        if enum_name not in self.enums:
          self.enums[enum_name] = {}

        self.enums[enum_name][enum_field] = constant.value


MessageSpecification.parse_enums = __msgspec_parse_enums


def mangle_type(ros_type):
  return f'{ros_type.pkg_name}__msg__{ros_type.type}'


def get_full_type_str(ros_type):
  if ros_type.pkg_name is None:
    return ros_type.type
  return f'{ros_type.pkg_name}/{ros_type.type}'


def parse_packages(ros2_pkgs):
  import os
  from os.path import join as joinp, relpath
  from ament_index_python.packages import get_package_share_directory

  dependent_pkgs = set(ros2_pkgs)
  for ros2_pkg in ros2_pkgs:
    print(ros2_pkg)
    pkg_dir = get_package_share_directory(ros2_pkg)
    for dirpath, _, filenames in os.walk(pkg_dir):
      for filename in filenames:
        filepath = joinp(dirpath, filename)
        if filename.endswith('.msg'):
          msgspec = parse_message_file(ros2_pkg, filepath)
          msgspec.reldir = relpath(dirpath, pkg_dir)
          full_type_str = get_full_type_str(msgspec.base_type)
          __parsed_msgs[full_type_str] = msgspec
          for field in msgspec.fields:
            field.js_type = JsType(field.type)
            full_type_str = get_full_type_str(field.type)
            if full_type_str not in __parsed_msgs and field.type.pkg_name:
              dependent_pkgs.add(field.type.pkg_name)
        elif filename.endswith('.srv'):
          srvspec = parse_service_file(ros2_pkg, filepath)
          srvspec.reldir = relpath(dirpath, pkg_dir)
          full_type_str = f'{srvspec.pkg_name}/{srvspec.srv_name}'
          __parsed_srvs[full_type_str] = srvspec
        else:
          continue
  dependent_pkgs = dependent_pkgs.difference(ros2_pkgs)
  if dependent_pkgs:
    parse_packages(dependent_pkgs)


def generate(dstdir):
  import jinja2
  from jinja2 import Environment, FileSystemLoader
  from os import makedirs
  from os.path import basename, dirname, exists, join as joinp

  template_loader = FileSystemLoader(searchpath=joinp(dirname(dirname(__file__)), 'templates'))
  template_env = Environment(loader=template_loader)
  template_env.trim_blocks = True
  template_env.keep_trailing_newline = True
  template_env.globals['mangle_type'] = mangle_type
  template = template_env.get_template('ts-definition.j2')

  for _, msgspec in __parsed_msgs.items():
    if not isinstance(msgspec, str):
      base_type = msgspec.base_type
      pkg_name = base_type.pkg_name
      output_fpath = joinp(dstdir, pkg_name, msgspec.reldir, f'{msgspec.base_type.type}.ts')

      if not exists(dirname(output_fpath)):
        makedirs(dirname(output_fpath))

      print(f'Generating model {base_type}')
      template.stream(
        msgspec=msgspec
      ).dump(output_fpath)

  template = template_env.get_template('srv-ts-definition.j2')
  for full_type, srvspec in __parsed_srvs.items():
    if not isinstance(srvspec, str):
      output_fpath = joinp(dstdir, srvspec.pkg_name, srvspec.reldir, f'{srvspec.srv_name}.srv.ts')

      if not exists(dirname(output_fpath)):
        makedirs(dirname(output_fpath))

      print(f'Generating model {full_type}')
      template.stream(
        srvspec=srvspec
      ).dump(output_fpath)


def generate_index(target_pkgs, dstdir):
  from jinja2 import Environment, FileSystemLoader
  from os import makedirs
  from os.path import basename, dirname, exists, join as joinp

  template_loader = FileSystemLoader(searchpath=joinp(dirname(dirname(__file__)), 'templates'))
  template_env = Environment(loader=template_loader)
  template_env.trim_blocks = True
  template_env.keep_trailing_newline = True
  template = template_env.get_template('index.j2')

  in_target_pkg = []
  in_target_pkg_srv = []
  for msgspec in __parsed_msgs.values():
    if isinstance(msgspec, str):
      continue
    if msgspec.base_type.pkg_name in target_pkgs:
      in_target_pkg.append(msgspec)
  for msgspec in __parsed_srvs.values():
    if isinstance(msgspec, str):
      continue
    if msgspec.pkg_name in target_pkgs:
      in_target_pkg_srv.append(msgspec)
  output_fpath = joinp(dstdir, 'index.ts')
  template.stream(
    msgspecs=in_target_pkg,
    srvspecs=in_target_pkg_srv,
  ).dump(output_fpath)


def run_main():
  parser = argparse.ArgumentParser()
  parser.add_argument(
    'dstdir',
    help='Output directory',
  )
  parser.add_argument(
    'ros2_pkgs',
    help='ROS2 package to search the .msg files.',
    nargs='+',
  )
  args = parser.parse_args()
  print(f'Parsing packages {args.ros2_pkgs} ...')
  parse_packages(args.ros2_pkgs)
  print(f'Generating typescript interfaces')
  generate(args.dstdir)
  print(f'Generating index')
  generate_index(args.ros2_pkgs, args.dstdir)
  print('Successfully generated typings')


if __name__ == '__main__':
  try:
    run_main()
  except KeyboardInterrupt:
    pass
