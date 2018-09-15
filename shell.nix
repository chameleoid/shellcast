with import <nixpkgs> {};

stdenv.mkDerivation rec {
  name = "shellcast";

  buildInputs = [
    nodejs-8_x
    yarn
    foreman
    gnumake
  ];

  shellHook = ''
    export PATH="$PWD/node_modules/.bin/:$PATH"
    export NODE_ENV=development
  '';
}
