#include <iostream>
#include <fcgi_stdio.h>
#include <cstdlib>
#include <fstream>
#include <string>
#include "json.hpp"
#include "fcgio.h"
using namespace std;
using json = nlohmann::json;

fstream data; // File with all the data of this system
json request, response, record; // JSON for request, response and existed data record
double rate = 1.5; // Rate from payment to points
int destination, operation, index; // Request Judgement, Shunt and JSON data array index

class DATA
// Base class of the whole program
{
public:
	DATA(json req)
	{
		request = req;
		data.open("data.json", ios::in);
		data >> record;
		data.close();
	}

	~DATA()
	{
		data.open("data.json", ios::out);
		data << record;
		data.close();
	}
};

class Sales: public DATA
// Sales class with Sell and Return function
{
public:
	Sales(json req): DATA(req)
	{
		switch(operation)
		{
			case 1: sell_item(); break;
			case 2: return_item(); break;
			case 3: input_limit(); break;
		}
	}

private:
	int sell_item()
	{
		index = request["itemID"];
		int inventoryQuantity = record["items"][index]["inventoryQuantity"];
		record["items"][index]["inventoryQuantity"] = inventoryQuantity - 1;

		record["finance"].push_back(
		{
			{"name", "Sell Record"},
			{"income", record["items"][index]["salePrice"]},
			{"expenditure", 0},
			{"date", 
				{
					{"year", request["year"]},
					{"month", request["month"]},
					{"day", request["day"]}
				}
			}
		});

		double points = record["items"][index]["salePrice"];

		index = request["customerID"];
		double totalPoints = record["customers"][index]["totalPoints"];

		record["customers"][index]["purchases"].push_back(
		{
			{"purchaseTime", request["time"]},
			{"payment", points},
			{"points", points * rate}
		});
		record["customers"][index]["totalPoints"] = totalPoints + points * rate;

		response ={{"code", 0}};
		cout << response;
		return 0;
	}

	int return_item()
	{
		index = request["itemID"];
		int inventoryQuantity = record["items"][index]["inventoryQuantity"];
		record["items"][index]["inventoryQuantity"] = inventoryQuantity + 1;

		record["finance"].push_back(
		{
			{"name", "Return Record"},
			{"income", 0},
			{"expenditure", record["items"][index]["salePrice"]},
			{"date", 
				{
					{"year", request["year"]},
					{"month", request["month"]},
					{"day", request["day"]}
				}
			}
		});

		double points = record["items"][index]["salePrice"];

		index = request["customerID"];
		double totalPoints = record["customers"][index]["totalPoints"];
		points = - points;

		record["customers"][index]["purchases"].push_back(
		{
			{"purchaseTime", request["time"]},
			{"payment", points},
			{"points", points * rate}
		});
		record["customers"][index]["totalPoints"] = totalPoints + points * rate;

		response ={{"code", 0}};
		cout << response;
		return 0;
	}

	int input_limit()
	{
		response =
		{
			{"items", record["items"].size()},
			{"suppliers", record["suppliers"].size()},
			{"customers", record["customers"].size()}
		};
		cout << response;
		return 0;
	}
};

class Inventory: public DATA
// Inventory class with Add, Update function
{
public:
	Inventory(json req): DATA(req)
	{
		switch(operation)
		{
			case 1: display(); break;
			case 2: add(); break;
			case 3: update(); break;
		}
	}

private:
	int display()
	{
		response = record["items"];
		cout << response;
		return 0;
	}

	int add()
	{
		record["items"].push_back(
		{
			{"barcode", request["barcode"]},
			{"brand", request["brand"]},
			{"name", request["name"]},
			{"type", request["type"]},
			{"unspsc", request["unspsc"]},
			{"price", request["price"]},
			{"salePrice", request["salePrice"]},
			{"inventoryQuantity", request["inventoryQuantity"]},
			{"threshold", request["threshold"]},
			{"expiredTime", request["expiredTime"]},
			{"importTime", request["time"]},
			{"updateTime", request["time"]}
		});

		double amount = request["inventoryQuantity"], price = request["price"];
		record["finance"].push_back(
		{
			{"name", "Inventory Add Record"},
			{"income", 0},
			{"expenditure", amount * price},
			{"date", 
				{
					{"year", request["year"]},
					{"month", request["month"]},
					{"day", request["day"]}
				}
			}
		});

		index = request["supplierID"];
		int itemID = record["items"].size();
		record["suppliers"][index]["transactions"].push_back(
		{
			{"transactionTime", request["time"]},
			{"itemID", itemID},
			{"itemName", request["name"]},
			{"itemAmount", request["inventoryQuantity"]},
			{"itemPrice", request["price"]}
		});

		response ={{"code", 0}};
		cout << response;
		return 0;
	}

	int update()
	{
		index = request["itemID"];
		record["items"][index] =
		{
			{"barcode", record["items"][index]["barcode"]},
			{"brand", request["brand"]},
			{"name", request["name"]},
			{"type", request["type"]},
			{"unspsc", request["unspsc"]},
			{"price", request["price"]},
			{"salePrice", request["salePrice"]},
			{"inventoryQuantity", request["inventoryQuantity"]},
			{"threshold", request["threshold"]},
			{"expiredTime", request["expiredTime"]},
			{"importTime", record["items"][index]["importTime"]},
			{"updateTime", request["time"]}
		};

		double amount = request["inventoryQuantity"], price = request["price"];
		record["finance"].push_back(
		{
			{"name", "Inventory Update Record"},
			{"income", 0},
			{"expenditure", amount * price},
			{"date", 
				{
					{"year", request["year"]},
					{"month", request["month"]},
					{"day", request["day"]}
				}
			}
		});

		index = request["supplierID"];
		record["suppliers"][index]["transactions"].push_back(
		{
			{"transactionTime", request["time"]},
			{"itemID", request["itemID"]},
			{"itemName", request["name"]},
			{"itemAmount", request["inventoryQuantity"]},
			{"itemPrice", request["price"]}
		});

		response ={{"code", 0}};
		cout << response;
		return 0;
	}
};

class Staff: public DATA
// Staff class with Add, Update function
{
public:
	Staff(json req): DATA(req)
	{
		switch(operation)
		{
			case 1: display(); break;
			case 2: add(); break;
			case 3: update(); break;
		}
	}

private:
	int display()
	{
		response = record["staffs"];
		cout << response;
		return 0;
	}

	int add()
	{
		record["staffs"].push_back(
		{
			{"jobNo", request["jobNo"]},
			{"name", request["name"]},
			{"gender", request["gender"]},
			{"nation", request["nation"]},
			{"nativePlace", request["nativePlace"]},
			{"department", request["department"]},
			{"postion", request["postion"]},
			{"birthday", request["birthday"]},
			{"contact", request["contact"]},
			{"address", request["address"]},
			{"salary", request["salary"]},
			{"entryTime", request["entryTime"]},
			{"status", request["status"]}
		});

		response ={{"code", 0}};
		cout << response;
		return 0;
	}

	int update()
	{
		index = request["staffID"];
		record["staffs"][index] =
		{
			{"jobNo", request["jobNo"]},
			{"name", request["name"]},
			{"gender", request["gender"]},
			{"nation", request["nation"]},
			{"nativePlace", request["nativePlace"]},
			{"department", request["department"]},
			{"postion", request["postion"]},
			{"birthday", request["birthday"]},
			{"contact", request["contact"]},
			{"address", request["address"]},
			{"salary", request["salary"]},
			{"entryTime", request["entryTime"]},
			{"status", request["status"]}
		};

		response ={{"code", 0}};
		cout << response;
		return 0;
	}
};

class Finance: public DATA
// Finance class with Display function
{
public:
	Finance(json req): DATA(req)
	{
		switch(operation)
		{
			case 1: display(); break;
			case 2: add(); break;
		}
	}

private:
	int display()
	{
		response = record["finance"];
		cout << response;
		return 0;
	}

	int add()
	{
		record["finance"].push_back(
		{
			{"name", request["financeName"]},
			{"income", request["income"]},
			{"expenditure", request["expenditure"]},
			{"date", 
				{
					{"year", request["year"]},
					{"month", request["month"]},
					{"day", request["day"]}
				}
			}
		});

		response ={{"code", 0}};
		cout << response;
		return 0;
	}
};

class Report: public DATA
// Report class with Display function
{
public:
	Report(json req): DATA(req)
	{
		switch(operation)
		{
			case 1: finance_data(); break;
			case 2: suppliers_data(); break;
			case 3: customers_data(); break;
		}
	}

private:
	int finance_data()
	{
		response = record["finance"];
		cout << response;
		return 0;
	}

	int suppliers_data()
	{
		response = record["suppliers"];
		cout << response;
		return 0;
	}

	int customers_data()
	{
		response = record["customers"];
		cout << response;
		return 0;
	}
};



// Function to get request POST data
// Source: http://chriswu.me/blog/getting-request-uri-and-content-in-c-plus-plus-fcgi/
// Actually all FastCGI-Related code below are from this site
const unsigned long STDIN_MAX = 1000000;

string get_request_content(const FCGX_Request & request) {
    char * content_length_str = FCGX_GetParam("CONTENT_LENGTH", request.envp);
    unsigned long content_length = STDIN_MAX;

    if (content_length_str) {
        content_length = strtol(content_length_str, &content_length_str, 10);
        if (*content_length_str) {
            cerr << "Can't Parse 'CONTENT_LENGTH='"
                 << FCGX_GetParam("CONTENT_LENGTH", request.envp)
                 << "'. Consuming stdin up to " << STDIN_MAX << endl;
        }

        if (content_length > STDIN_MAX) {
            content_length = STDIN_MAX;
        }
    } else {
        // Do not read from stdin if CONTENT_LENGTH is missing
        content_length = 0;
    }

    char * content_buffer = new char[content_length];
    cin.read(content_buffer, content_length);
    content_length = cin.gcount();

    // Chew up any remaining stdin - this shouldn't be necessary
    // but is because mod_fastcgi doesn't handle it correctly.

    // ignore() doesn't set the eof bit in some versions of glibc++
    // so use gcount() instead of eof()...
    do cin.ignore(1024); while (cin.gcount() == 1024);

    string content(content_buffer, content_length);
    delete [] content_buffer;
    return content;
}

int main(int argc, char const *argv[])
{
	// Backup the stdio streambufs
	streambuf * cin_streambuf  = cin.rdbuf();
	streambuf * cout_streambuf = cout.rdbuf();
	streambuf * cerr_streambuf = cerr.rdbuf();

	FCGX_Request req;

	FCGX_Init();
	FCGX_InitRequest(&req, 0, 0);

	while (FCGX_Accept_r(&req) == 0) {
		fcgi_streambuf cin_fcgi_streambuf(req.in);
		fcgi_streambuf cout_fcgi_streambuf(req.out);
		fcgi_streambuf cerr_fcgi_streambuf(req.err);

		cin.rdbuf(&cin_fcgi_streambuf);
		cout.rdbuf(&cout_fcgi_streambuf);
		cerr.rdbuf(&cerr_fcgi_streambuf);

		string content = get_request_content(req);

		cout << "Content-Type: application/json\n\n";

		json request = json::parse(content);

		destination = request["destination"];
		operation = request["operation"];

		switch (destination)
		{
			case 1: { Sales obj(request); } break;
			case 2: { Inventory obj(request); } break;
			case 3: { Staff obj(request); } break;
			case 4: { Finance obj(request); } break;
			case 5: { Report obj(request); } break;
		}
	}

	// Restore stdio streambufs
	cin.rdbuf(cin_streambuf);
	cout.rdbuf(cout_streambuf);
	cerr.rdbuf(cerr_streambuf);
	return 0;
}
