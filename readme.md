Shellcast [![dependencies][]][Gemnasium]
=========
A shellcasting service

[builds]: http://img.shields.io/travis-ci/rummik/shellcast.png "Build Status"
[Travis]: https://travis-ci.org/rummik/shellcast
[dependencies]: https://gemnasium.com/rummik/shellcast.png "Dependency Status"
[Gemnasium]: https://gemnasium.com/rummik/shellcast


## Getting Started

Install shellcast:
```
$ npm install -g shellcast
```

Start casting:
```
$ shellcast
Shellcasting to http://tty.tv/t/MBQUzy84
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
Copyright (c) 2013-2015
Licensed under the MPL license.
