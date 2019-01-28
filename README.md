# spectrum2mpe


> Convert spectrum data from MATLAB or SPEAR, into Standard MIDI File which is compatible with MPE applications.  
> This is the core engine of [spectral-mpe-editor](https://github.com/szk2s/spectral-mpe-editor) 
> ***Listen to the demo sounds [here](https://drive.google.com/drive/folders/1xU2hxmzMhu4SbaaS6ggDsQUYxpIQMYT8?usp=sharing)!!***

## Table of Contents

- [spectrum2mpe](#spectrum2mpe)
  - [Table of Contents](#table-of-contents)
  - [Install](#install)
  - [Usage](#usage)
  - [Development](#development)
    - [Build](#build)
    - [Run test](#run-test)
    - [Lint](#lint)
    - [Check types](#check-types)
    - [Add library definitions for npm modules](#add-library-definitions-for-npm-modules)
  - [References](#references)
  - [Maintainers](#maintainers)
  - [Contributing](#contributing)
  - [License](#license)

## Install
First, git clone or download this repository.   

Then install dependencies.
```
yarn add
```

Run example code and see the result.
```
node examples/convertFromSpear.js
```

## Usage
You can use s2m in your project like
```
const s2m = require('s2m');

( async () => {
  await s2m.convertFromSpear('path/to/file');
})();
```
For more information, check example code `./examples/convert.js`


## Development
You can use following commands
### Build  
Transpile `./src` to destination folder `./lib`
```
yarn build
```
You need do this only one time.

### Run test
```
yarn test
```

### Lint
```
yarn lint
```

### Check types
```
yarn flow
```

### Add library definitions for npm modules
```
 yarn flow-typed install lodash@4.17.11
```

## References
[Demo Sounds](https://drive.google.com/drive/folders/1xU2hxmzMhu4SbaaS6ggDsQUYxpIQMYT8?usp=sharing)  
[spectral-mpe-editor](https://github.com/szk2s/spectral-mpe-editor)  
[What's MPE?](http://mpe.js.org/ "mpe.js")  
[Spear (recommended spectral analysis tool)](http://www.klingbeil.com/spear/ "Spear")  
[How to make spectrum data with MATLAB?](https://github.com/szk2s/Spectral-Analysis "Spectral-Analysis")  
[The format of text file (Spear export)](https://sites.google.com/view/hintjam-frontier-of-music/%E3%83%9B%E3%83%BC%E3%83%A0 "Hint-Jam")  


## Maintainers

[@szk2s](https://github.com/szk2s)

## Contributing



Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © 2018 Satoshi Suzuki
