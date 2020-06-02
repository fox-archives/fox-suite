
type option = 'off' | 'cozy' | 'strict' | 'excessive'

export interface IFox {
  all: option,
  monorepo: boolean,
  module: {
    eslint: option
  }
}
