#include <iostream>
#include <fstream>
#include "json.hpp"
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

int main(int argc, char const *argv[])
{
	cin >> request;
	cout<<"Content-type: application/json\n\n";

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

	return 0;
}
