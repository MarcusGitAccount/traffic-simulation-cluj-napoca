export default {
  rho: 1.29, // (air density) <kg / m ^ 3> at 0°C and dry air
  frictionCoefficients: {
    tires: {
      roadSurfaces: {
        asphalt: {
          dry: 0.72,
          wet: 0.5
        }
      }
    }
  },
  carTypes: {
    a: {
      frontalArea: 2.2, // m^2
      frictionCoef: 0.3
    }
  }
};