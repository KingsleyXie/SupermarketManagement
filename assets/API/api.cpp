#include <iostream>
#include <fstream>
#include "json.hpp"
using namespace std;
using json = nlohmann::json;

fstream dataFile; // File with all the data of this system
json request, response, preData; // JSON for request, response and existed data record
double rate = 1.5; // Rate from payment to points
int  dest, operation, index; // Request Judgement, Shunt and JSON data array index



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

		newFinance["income"] = preData["items"][index]["salePrice"];
		newFinance["name"] = "Sell Auto Record";
		newFinance["date"]["year"] = request["year"];
		newFinance["date"]["month"] = request["month"];
		newFinance["date"]["day"] = request["day"];
		preData["finance"].push_back(newFinance);

		index = request["customerID"];
		double totalPoints = preData["customers"][index]["totalPoints"];
		double points = newFinance["income"];
		points *= rate;
		json purchase = {
			{"purchaseTime", request["time"]},
			{"payment", points / rate},
			{"points", points}
		};

		preData["customers"][index]["purchases"].push_back(purchase);
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

		newFinance["expenditure"] = preData["items"][index]["salePrice"];
		newFinance["name"] = "Return Auto Record";
		newFinance["date"]["year"] = request["year"];
		newFinance["date"]["month"] = request["month"];
		newFinance["date"]["day"] = request["day"];
		preData["finance"].push_back(newFinance);

		index = request["customerID"];
		double totalPoints = preData["customers"][index]["totalPoints"];
		double points = newFinance["expenditure"];
		points *= - rate;
		json purchase = {
			{"purchaseTime", request["time"]},
			{"payment", points / rate},
			{"points", points}
		};

		preData["customers"][index]["purchases"].push_back(purchase);
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

	json newData = 
	{
		{"barcode", ""},
		{"brand", ""},
		{"name", ""},
		{"type", ""},
		{"unspsc", ""},
		{"price", 0},
		{"salePrice", 0},
		{"inventoryQuantity", 0},
		{"threshold", 50},
		{"expiredTime", ""},
		{"importTime", ""},
		{"updateTime", ""}
	};

private:
	int Display()
	{
		response = preData["items"];
		cout << response;

		return 0;
	}

	int Add()
	{
		newData["barcode"] = request["barcode"];
		newData["brand"] = request["brand"];
		newData["name"] = request["name"];
		newData["type"] = request["type"];
		newData["unspsc"] = request["unspsc"];
		newData["price"] = request["price"];
		newData["salePrice"] = request["salePrice"];
		newData["inventoryQuantity"] = request["inventoryQuantity"];
		newData["threshold"] = request["threshold"];
		newData["expiredTime"] = request["expiredTime"];
		newData["importTime"] = request["time"];
		newData["updateTime"] = request["time"];
		preData["items"].push_back(newData);

		newFinance["income"] = 0;
		double amount = request["inventoryQuantity"], price = request["price"];
		newFinance["expenditure"] = amount * price;
		newFinance["name"] = "Inventory Auto Record";
		newFinance["date"]["year"] = request["year"];
		newFinance["date"]["month"] = request["month"];
		newFinance["date"]["day"] = request["day"];
		preData["finance"].push_back(newFinance);

		int itemID = preData["items"].size();
		index = request["supplierID"];
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
		preData["items"][index]["barcode"] = request["barcode"];
		preData["items"][index]["brand"] = request["brand"];
		preData["items"][index]["name"] = request["name"];
		preData["items"][index]["type"] = request["type"];
		preData["items"][index]["unspsc"] = request["unspsc"];
		preData["items"][index]["price"] = request["price"];
		preData["items"][index]["salePrice"] = request["salePrice"];
		preData["items"][index]["inventoryQuantity"] = request["inventoryQuantity"];
		preData["items"][index]["threshold"] = request["threshold"];
		preData["items"][index]["expiredTime"] = request["expiredTime"];
		preData["items"][index]["updateTime"] = request["time"];

		newFinance["income"] = 0;
		double amount = request["inventoryQuantity"], price = request["price"];
		newFinance["expenditure"] = amount * price;
		newFinance["name"] = "Inventory Auto Record";
		newFinance["date"]["year"] = request["year"];
		newFinance["date"]["month"] = request["month"];
		newFinance["date"]["day"] = request["day"];
		preData["finance"].push_back(newFinance);

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

	json newData = 
	{
		{"jobNo", ""},
		{"name", ""},
		{"gender", ""},
		{"nation", ""},
		{"nativePlace", ""},
		{"department", ""},
		{"postion", ""},
		{"birthday", ""},
		{"contact", ""},
		{"address", ""},
		{"salary", 0},
		{"entryTime", ""},
		{"status", ""}
	};

private:
	int Display()
	{
		response = preData["staffs"];
		cout << response;

		return 0;
	}

	int Add()
	{
		newData["jobNo"] = request["jobNo"];
		newData["name"] = request["name"];
		newData["gender"] = request["gender"];
		newData["nation"] = request["nation"];
		newData["nativePlace"] = request["nativePlace"];
		newData["department"] = request["department"];
		newData["postion"] = request["postion"];
		newData["birthday"] = request["birthday"];
		newData["contact"] = request["contact"];
		newData["address"] = request["address"];
		newData["salary"] = request["salary"];
		newData["entryTime"] = request["entryTime"];
		newData["status"] = request["status"];
		preData["staffs"].push_back(newData);

		response ={{"code", 0}};
		cout << response;

		return 0;
	}

	int Update()
	{
		index = request["staffID"];
		preData["staffs"][index]["jobNo"] = request["jobNo"];
		preData["staffs"][index]["name"] = request["name"];
		preData["staffs"][index]["gender"] = request["gender"];
		preData["staffs"][index]["nation"] = request["nation"];
		preData["staffs"][index]["nativePlace"] = request["nativePlace"];
		preData["staffs"][index]["department"] = request["department"];
		preData["staffs"][index]["postion"] = request["postion"];
		preData["staffs"][index]["birthday"] = request["birthday"];
		preData["staffs"][index]["contact"] = request["contact"];
		preData["staffs"][index]["address"] = request["address"];
		preData["staffs"][index]["salary"] = request["salary"];
		preData["staffs"][index]["entryTime"] = request["entryTime"];
		preData["staffs"][index]["status"] = request["status"];

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
	
	cout<<"Content-type:application/json\n\n";
	
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

		default:
			response ={{"code", 1}};
			cout << response;
			break;
	}

	return 0;
}
