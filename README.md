# Supermarket Management

### This is an online or local manage system for supermarkets, you can experience the system [here](https://projects.kingsleyxie.cn/supermarket-management/)

To compile the C++ code into a FastCGI application which is used in this system, you need to make sure your compiler supports C++11 Standard and [`fastcgi`](https://github.com/iriscouch/fastcgi) is correctly installed, then you can make the compile operation with:
```
$ g++ -std=c++11 -o api.cgi api.cpp -lfcgi++ -lfcgi
```

If you are trapped with compile process because of the `index` variable, you might need to change it to something else: `:%s/index/indexn/g`

To run the compiled FastCGI program as a service you'll need to install [`spawn-fcgi`](https://github.com/lighttpd/spawn-fcgi), and spawn the FastCGI application to listen a local port (`8081` for example here):
```
$ spawn-fcgi -a 127.0.0.1 -p 8081 -f /file_directory/api.cgi
```

It is recommended to check whether the service started successfully: `netstat -nap | grep 8081`

Moreover, sufficient access permission is needed for reading and writing data to file: `chmod 666 data.json`

**Preview pictures can be found in [`./assets/pictures/preview`](./assets/pictures/preview)**

### Special thanks to [Materialize](https://github.com/Dogfalo/materialize) and [JSON for C++](https://github.com/nlohmann/json), besides, this FastCGI version was deeply helped by a [blog](http://chriswu.me/blog/getting-request-uri-and-content-in-c-plus-plus-fcgi/).

***

#### Solution for https-only sites

Since the host of inventory API does not provide a `https` request method, if you deploy this system on a https-only website, the browser will prevent you from sending the request. To Solve the problem, `getDataFromAPI` function in [`./assets/js/inventory.js`](./assets/js/inventory.js) was rewrote to use PHP to send the request instead of using Javascript directly, and at the same time it prevents your APPCODE from being leaked to visitors. Anyway, the former version is still in the file being commented, you can choose whatever version you like easily.
