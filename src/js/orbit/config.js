import { getCurrentBreakPointId } from "./adaptivity.js";

export const maxSpeed = 5;

export const inf = Number.POSITIVE_INFINITY;

export const breakPoints = [
  [0, 480],
  [480, 834],
  [834, 1300],
  [1300, inf],
];

const numberAnimationDurationSeconds = 10;

const fiveYearsAnimationDurationSeconds = 1;
const fiveYearsDelaySeconds = 4;

const orbitsPartialData = [
  // [0, 428],
  [{
    width: 672,
    height: 672,
    gradientString: '65% 50% at 50% 50%, #6E40F2 0%, rgba(110, 64, 242, 0) 100%',
    borderWidth: 2,
    data: {
      // Starting angle
      angleDegrees: 130,
      maxAngle: 210,
      title: '{animated} years',
      animateNumber: {
        start: 1,
        end: 5,
        seconds: fiveYearsAnimationDurationSeconds,
        delay: fiveYearsDelaySeconds,
      },
      subtitle: 'on the market',
    },
  }, {
    width: 672,
    height: 672,
    gradientString: '65% 50% at 50% 50%, #6E40F2 0%, rgba(110, 64, 242, 0) 100%',
    borderWidth: 2,
    data: {
      // Starting angle
      angleDegrees: 100,
      maxAngle: 180,
      title: '${animated}',
      animateNumber: {
        start: 0,
        end: 864000,
        seconds: numberAnimationDurationSeconds,
      },
      subtitle: 'changed this month'
    },
  }, {
    width: 506,
    height: 506,
    gradientString: '65% 50% at 50% 50%, #6E40F2 0%, rgba(110, 64, 242, 0) 100%',
    borderWidth: 2,
    data: {
      // Starting angle
      angleDegrees: 90,
      maxAngle: 140,
      title: '{animated}',
      animateNumber: {
        start: 0,
        end: 3545,
        seconds: numberAnimationDurationSeconds,
      },
      subtitle: 'users'
    },
  }],

  // [480, 834],
  [{
    width: 636,
    height: 636,
    gradientString: '65% 50% at 50% 50%, #6E40F2 0%, rgba(110, 64, 242, 0) 100%',
    borderWidth: 2,
    data: {
      // Starting angle
      angleDegrees: 200,
      maxAngle: 285,
      title: '{animated} years',
      animateNumber: {
        start: 1,
        end: 5,
        seconds: fiveYearsAnimationDurationSeconds,
        delay: fiveYearsDelaySeconds,
      },
      subtitle: 'on the market',
    },
  }, {
    width: 536,
    height: 536,
    gradientString: '65% 50% at 50% 50%, #6E40F2 0%, rgba(110, 64, 242, 0) 100%',
    borderWidth: 2,
    data: {
      // Starting angle
      angleDegrees: 130,
      maxAngle: 220,
      title: '${animated}',
      animateNumber: {
        start: 0,
        end: 864000,
        seconds: numberAnimationDurationSeconds,
      },
      subtitle: 'changed this month'
    },
  }, {
    width: 536,
    height: 536,
    gradientString: '65% 50% at 50% 50%, #6E40F2 0%, rgba(110, 64, 242, 0) 100%',
    borderWidth: 2,
    data: {
      // Starting angle
      angleDegrees: 90,
      maxAngle: 160,
      title: '{animated}',
      animateNumber: {
        start: 0,
        end: 3545,
        seconds: numberAnimationDurationSeconds,
      },
      subtitle: 'users'
    },
  }],

  // [834, 1300],
  [{
    width: 976,
    height: 976,
    gradientString: '65% 50% at 50% 50%, #6E40F2 0%, rgba(110, 64, 242, 0) 100%',
    borderWidth: 2,
    data: {
      // Starting angle
      angleDegrees: 200,
      maxAngle: 310,
      title: '{animated} years',
      animateNumber: {
        start: 1,
        end: 5,
        seconds: fiveYearsAnimationDurationSeconds,
        delay: fiveYearsDelaySeconds,
      },
      subtitle: 'on the market',
    },
  }, {
    width: 736,
    height: 736,
    gradientString: '65% 50% at 50% 50%, #6E40F2 0%, rgba(110, 64, 242, 0) 100%',
    borderWidth: 2,
    data: {
      // Starting angle
      angleDegrees: 130,
      maxAngle: 220,
      title: '${animated}',
      animateNumber: {
        start: 0,
        end: 864000,
        seconds: numberAnimationDurationSeconds,
      },
      subtitle: 'changed this month'
    },
  }, {
    width: 736,
    height: 736,
    gradientString: '65% 50% at 50% 50%, #6E40F2 0%, rgba(110, 64, 242, 0) 100%',
    borderWidth: 2,
    data: {
      // Starting angle
      angleDegrees: 90,
      maxAngle: 160,
      title: '{animated}',
      animateNumber: {
        start: 0,
        end: 3545,
        seconds: numberAnimationDurationSeconds,
      },
      subtitle: 'users'
    },
  }],

  // [1300, inf],
  [{
    width: 1238,
    height: 1238,
    gradientString: '65% 50% at 50% 50%, #6E40F2 0%, rgba(110, 64, 242, 0) 100%',
    borderWidth: 2,
    data: {
      // Starting angle
      angleDegrees: 90,
      maxAngle: 190,
      title: '{animated} years',
      animateNumber: {
        start: 1,
        end: 5,
        seconds: fiveYearsAnimationDurationSeconds,
        delay: fiveYearsDelaySeconds,
      },
      subtitle: 'on the market',
    },
  }, {
    width: 976,
    height: 976,
    gradientString: '65% 50% at 50% 50%, #6E40F2 0%, rgba(110, 64, 242, 0) 100%',
    borderWidth: 2,
    data: {
      // Starting angle
      angleDegrees: 90,
      maxAngle: 170,
      title: '${animated}',
      animateNumber: {
        start: 0,
        end: 864000,
        seconds: numberAnimationDurationSeconds,
      },
      subtitle: 'changed this month'
    },
  }, {
    width: 736,
    height: 736,
    gradientString: '65% 50% at 50% 50%, #6E40F2 0%, rgba(110, 64, 242, 0) 100%',
    borderWidth: 2,
    data: {
      // Starting angle
      angleDegrees: 90,
      maxAngle: 130,
      title: '{animated}',
      animateNumber: {
        start: 0,
        end: 3545,
        seconds: numberAnimationDurationSeconds,
      },
      subtitle: 'users'
    },
  }],
];

export function getOrbitsPartialData() {
  const id = getCurrentBreakPointId();

  return orbitsPartialData[id];
}
