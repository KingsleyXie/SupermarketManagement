# Supermarket Management

### This is an online or local manage system for supermarkets, you can experience the system [here](https://kingsleyxie.cn/supermarket-management/)

To compile the C++ code into a CGI file which is used in this system, you need to make sure your compiler supports C++11 Standard: `g++ -std=c++11 -o api.cgi api.cpp`

If you are trapped with compile process because of the `index` variable, you might need to change it to something else: `:%s/index/indexn/g`

Moreover, sufficient access permission is needed for reading and writing data to file: `chmod 666 data.json`

You'll need a program which can execute CGI if you need to deploy it on your server or experience locally, if `Apache` is chosen by you, add following options in the corresponding location (`<Directory "/var/www/html">` part for example) of  `httpd.conf` configuration file:

  - Options +ExecCGI
  - AddHandler cgi-script .cgi

**Preview pictures can be found in [`./assets/pictures/preview`](./assets/pictures/preview)**

### Special thanks to [Materialize](https://github.com/Dogfalo/materialize) and [JSON for C++](https://github.com/nlohmann/json).