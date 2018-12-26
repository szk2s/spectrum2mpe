# spectrum2mpe


> Convert spectrum data from MATLAB or SPEAR, into Standard MIDI File which is compatible with MPE applications.

## Table of Contents

- [spectrum2mpe](#spectrum2mpe)
  - [Table of Contents](#table-of-contents)
  - [Install](#install)
  - [Usage](#usage)
  - [References](#references)
  - [Maintainers](#maintainers)
  - [Contributing](#contributing)
  - [License](#license)

## Install
First, git clone or download this repository.   

Then install dependencies.
```
npm i
```
Run example code and see the result.
```
node examples/convert.js
```

## Usage
```
( async () => {
  const s2m = require('s2m');
  await s2m.convertFromSpear('path/to/file');
})();
```
(await s2m.convertFromSpear('path/to/file');})();
For more information, check example code `./examples/convert.js`

## References
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
