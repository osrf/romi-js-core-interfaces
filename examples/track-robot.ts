import * as romicore from '../lib';

async function trackRobot() {
  const transport = await romicore.RclTransport.create('example');

  transport.subscribe(romicore.fleetStates, fleetState => {
    for (const robot of fleetState.robots) {
      console.log(robot.name, robot.location);
    }
  });
}

trackRobot();
