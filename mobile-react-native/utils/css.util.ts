export const CssUtil = {
  GenerateBoxShadow: (
    color: string,
    offsetWidth: number,
    offsetheight: number,
    shadowOpacity: number,
    shadowRadius: number,
    elevation: number,
  ) => {
    let attr = {
      shadowColor: '#171717',
      shadowOffset: {width: 10, height: 10},
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 4,
    };
    return {...{}};
  },
  GenerateDefaultBoxShadow: () => {
    let attr = {
      shadowColor: '#171717',
      shadowOffset: {width: 10, height: 10},
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 4,
    };
    return {...attr};
  },
};
