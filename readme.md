Shellcast [![Builds][]][travis] [![Deps][]][gemnasium] [![Donations][]][gittip]
=========
A shellcasting service

[Builds]: http://img.shields.io/travis-ci/rummik/shellcast.png "Build Status"
[travis]: https://travis-ci.org/rummik/shellcast
[Deps]: https://gemnasium.com/rummik/shellcast.png "Dependency Status"
[gemnasium]: https://gemnasium.com/rummik/shellcast
[Donations]: http://img.shields.io/gratipay/rummik.svg
[gittip]: https://www.gittip.com/rummik/


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

Take care to maintain the existing coding style.  Add unit tests for any new or
changed functionality.  Lint and test your code using [Grunt][].

[Chameleoid Styleguide]: https://github.com/chameleoid/style
[Grunt]: http://gruntjs.com/


## License
Copyright (c) 2013-2014
Licensed under the MPL license.
