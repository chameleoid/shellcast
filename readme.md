[![dependencies][]][Gemnasium]

Shellcast
=========
A shellcasting service

[builds]: http://img.shields.io/travis-ci/chameleoid/shellcast.svg "Build Status"
[Travis]: https://travis-ci.org/chameleoid/shellcast
[dependencies]: https://img.shields.io/gemnasium/chameleoid/shellcast.png "Dependency Status"
[Gemnasium]: https://gemnasium.com/chameleoid/shellcast


## Getting Started

Install shellcast:
```
$ npm install -g shellcast
```

Start casting:
```
$ shellcast
Shellcasting to https://tty.tv/t/MBQUzy84
$ ls /
bin   cdrom  etc   initrd.img      lib    lib64       media  opt   root  sbin  sys  usr  vmlinuz
boot  dev    home  initrd.img.old  lib32  lost+found  mnt    proc  run   srv   tmp  var  vmlinuz.old
$
```

Shellcast will then relay your TTY to tty.tv at the provided URL


## Contributing
Please see the [Chameleoid Styleguide][] before contributing.

Take care to maintain the existing coding style.

[Chameleoid Styleguide]: https://github.com/chameleoid/style


## License
Copyright (c) 2013-2017 Chameleoid and Kimberly Zick (rummik)

Licensed under the MPL license
