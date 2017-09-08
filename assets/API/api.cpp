#include <iostream>
#include <fstream>
#include "json.hpp"
using namespace std;
using json = nlohmann::json;

fstream dataFile; // File with all the data of this system
json request, response, preData; // JSON for request, response and existed data record
double rate = 1.5; // Rate from payment to points
int dest, operation, index; // Request Judgement, Shunt and JSON data array index

class DATAFILE
// Base class of the whole program
{
public:
	DATAFILE(json input)
	{
		request = input;
		dataFile.open("data", ios::in | ios::out);
		dataFile >> preData;
	}

	~DATAFILE()
	{
		dataFile.seekg(0);
		dataFile << preData;
		dataFile.close();
	}

	json newFinance = 
	{
		{"name", ""},
		{"income", 0},
		{"expenditure", 0},
		{"date", 
			{
				{"year", 0},
				{"month", 0},
				{"day", 0}
			}
		}
	};
};

class Sales: public DATAFILE
// Sales class with Sell and Return function
{
public:
	Sales(json para): DATAFILE(para) {}
	int Exec()
	{
		switch(operation)
		{
			case 1:
				Sell();
				break;
			case 2:
				Return();
				break;
		}
		return 0;
	}

private:
	int Sell()
	{
		index = request["itemID"];
		int inventoryQuantity = preData["items"][index]["inventoryQuantity"];
		preData["items"][index]["inventoryQuantity"] = inventoryQuantity - 1;

		preData["finance"].push_back(
		{
			{"name", "Sell Auto Record"},
			{"income", preData["items"][index]["salePrice"]},
			{"expenditure", 0},
			{"date", 
				{
					{"year", request["year"]},
					{"month", request["month"]},
					{"day", request["day"]}
				}
			}
		});

		index = request["customerID"];
		double totalPoints = preData["customers"][index]["totalPoints"], points = preData["items"][index]["salePrice"];
		points *= rate;

		preData["customers"][index]["purchases"].push_back(
		{
			{"purchaseTime", request["time"]},
			{"payment", points / rate},
			{"points", points}
		});
		preData["customers"][index]["totalPoints"] = totalPoints + points;

		response ={{"code", 0}};
		cout << response;
		return 0;
	}

	int Return()
	{
		index = request["itemID"];
		int inventoryQuantity = preData["items"][index]["inventoryQuantity"];
		preData["items"][index]["inventoryQuantity"] = inventoryQuantity + 1;

		preData["finance"].push_back(
		{
			{"name", "Return Auto Record"},
			{"income", 0},
			{"expenditure", preData["items"][index]["salePrice"]},
			{"date", 
				{
					{"year", request["year"]},
					{"month", request["month"]},
					{"day", request["day"]}
				}
			}
		});

		index = request["customerID"];
		double totalPoints = preData["customers"][index]["totalPoints"], points = preData["items"][index]["salePrice"];
		points *= - rate;

		preData["customers"][index]["purchases"].push_back(
		{
			{"purchaseTime", request["time"]},
			{"payment", points / rate},
			{"points", points}
		});
		preData["customers"][index]["totalPoints"] = totalPoints + points;

		response ={{"code", 0}};
		cout << response;
		return 0;
	}
};

class Inventory: public DATAFILE
// Inventory class with Add, Update function
{
public:
	Inventory(json para): DATAFILE(para) {}
	int Exec()
	{
		switch(operation)
		{
			case 1:
				Display();
				break;
			case 2:
				Add();
				break;
			case 3:
				Update();
				break;
		}
		return 0;
	}

private:
	int Display()
	{
		response = preData["items"];
		cout << response;
		return 0;
	}

	int Add()
	{
		preData["items"].push_back(
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
		preData["finance"].push_back(
		{
			{"name", "Inventory Auto Record"},
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
		int itemID = preData["items"].size();
		preData["suppliers"][index]["transaction"].push_back(
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

	int Update()
	{
		index = request["itemID"];
		preData["items"][index] =
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
			{"updateTime", request["time"]}
		};

		double amount = request["inventoryQuantity"], price = request["price"];
		preData["finance"].push_back(
		{
			{"name", "Inventory Auto Record"},
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
		preData["suppliers"][index]["transaction"].push_back(
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

class Staff: public DATAFILE
// Staff class with Add, Update function
{
public:
	Staff(json para): DATAFILE(para) {}
	int Exec()
	{
		switch(operation)
		{
			case 1:
				Display();
				break;
			case 2:
				Add();
				break;
			case 3:
				Update();
				break;
		}
		return 0;
	}

private:
	int Display()
	{
		response = preData["staffs"];
		cout << response;
		return 0;
	}

	int Add()
	{
		preData["staffs"].push_back(
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

	int Update()
	{
		index = request["staffID"];
		preData["staffs"][index] =
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

class Finance: public DATAFILE
// Finance class with Display function
{
public:
	Finance(json para): DATAFILE(para) {}

	int Exec()
	{
		switch(operation)
		{
			case 1:
				Display();
				break;
			case 2:
				Add();
				break;
		}
		return 0;
	}

private:
	int Display()
	{
		response = preData["finance"];
		cout << response;

		return 0;
	}

	int Add()
	{
		
		newFinance["income"] = request["income"];
		newFinance["expenditure"] = request["expenditure"];
		newFinance["name"] = request["financeName"];
		newFinance["date"]["year"] = request["year"];
		newFinance["date"]["month"] = request["month"];
		newFinance["date"]["day"] = request["day"];
		preData["finance"].push_back(newFinance);

		response ={{"code", 0}};
		cout << response;

		return 0;
	}
};

class Report: public DATAFILE
// Report class with Display function
{
public:
	Report(json para): DATAFILE(para) {}

	int Exec()
	{
		switch(operation)
		{
			case 1:
				FinanceData();
				break;
			case 2:
				ClientsData();
				break;
		}
		return 0;
	}

private:
	int FinanceData()
	{
		response = preData["finance"];
		cout << response;

		return 0;
	}

	int ClientsData()
	{
		response["suppliers"] = preData["suppliers"];
		response["customers"] = preData["customers"];
		cout << response;

		return 0;
	}
};

int main(int argc, char const *argv[])
{
	json req;
	cin >> req;
	dest = req["dest"];
	operation = req["operation"];
	
	cout<<"Content-type: application/json\n\n";
	
	switch (dest)
	{
		case 1:
			{
				Sales R(req);
				R.Exec();
			}
			break;

		case 2:
			{
				Inventory R(req);
				R.Exec();
			}
			break;

		case 3:
			{
				Staff R(req);
				R.Exec();
			}
			break;

		case 4:
			{
				Finance R(req);
				R.Exec();
			}
			break;

		case 5:
			{
				Report R(req);
				R.Exec();
			}
			break;
	}

	return 0;
}
