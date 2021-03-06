# Supermarket Management

### This is an online or local manage system for supermarkets, you can experience the system [here](https://projects.kingsleyxie.cn/supermarket-management/)

To compile the C++ code into a CGI file which is used in this system, you need to make sure your compiler supports C++11 Standard:
```
$ g++ -std=c++11 -o api.cgi api.cpp
```

Moreover, sufficient access permission is needed for reading and writing data to file: `chmod 666 data.json`

You'll need a program which can execute CGI if you need to deploy it on your server or experience locally, if `Apache` is chosen by you, add following options in the corresponding location (`<Directory "/var/www/html">` part for example) of `httpd.conf` configuration file:

  - Options +ExecCGI
  - AddHandler cgi-script .cgi

**Preview pictures can be found in [`./assets/pictures/preview`](./assets/pictures/preview)**

### Special thanks to [Materialize](https://github.com/Dogfalo/materialize) and [JSON for C++](https://github.com/nlohmann/json).

***

#### Solution for https-only sites

Since the host of inventory API does not provide a `https` request method, if you deploy this system on a https-only website, the browser will prevent you from sending the request. To Solve the problem, `getDataFromAPI` function in [`./assets/js/inventory.js`](./assets/js/inventory.js) was rewrote to use PHP to send the request instead of using Javascript directly, and at the same time it prevents your APPCODE from being leaked to visitors. Anyway, the former version is still in the file being commented, you can choose whatever version you like easily.
