# Installing

This library depends on [rmf_core](https://github.com/osrf/rmf_core).

To build the library, make sure `rmf_core` is sourced, then run `npm run build`. Alternatively, you
can build it in a colcon workspace along with `rmf_core`.

After confirming this package is built correctly, Install this library as a npm module:

```
npm install <path-to-romi-js>/dist/lib
```

# Running the examples

Before using this library, make sure the rmf workspace is sourced.

```
source <romi-root>/build/ros2/install/setup.bash
```

Note that the examples are using relative import, when using the library, out-of-tree, you need to
change it to absolute import.

E.g.:

change
```
import * as romicore from '../lib';
```
to
```
import * as romicore from '@romi/core';
```
