package com.jsonparser.jsonparser.exceltosql;

import java.nio.file.Files;
import java.nio.file.Paths;

import com.github.opendevl.JFlat;
import com.jsonparser.jsonparser.util.CsvToExcel;

public class JsonParser {

	public void parseJson(String jsonFile) throws Exception {

		System.gc();
		//Start Time
		long startTime = System.currentTimeMillis();
		System.out.println("Start Time:" + String.valueOf(startTime));
		//Starting to read the file
		System.out.println("File read starting!");
		
		String json_str = new String(Files.readAllBytes(Paths.get(jsonFile)));
		System.out.println("File read completed!");
		
		//Object of JFlat class to pass the json_str.
		JFlat flatMe = new JFlat(json_str);

		// get the 2D representation of JSON document
		// use "_" as seperator between names.
		flatMe.json2Sheet().headerSeparator("_").getJsonAsSheet();
	
		System.out.println("Writing now!");
		// write the 2D representation in csv format
		// Name of csv file whch would be generated.
		String csvFileName = "E:\\DBInternProject\\testing\\test1.csv";
		flatMe.write2csv(csvFileName);
		//End Time
		
		long endTime = System.currentTimeMillis();
		System.out.println("Time Taken:" + String.valueOf(endTime - startTime));

		// convert csv to xlsx
		String xlsFileName = "";
		String xlsFilePath = "E:\\DBInternProject\\testing\\";
		xlsFileName = CsvToExcel.convertCsvToXls(xlsFilePath, csvFileName);

		// save xlsx into MySQL database table
		ExcelToSQLTable.saveIntoDatabase(xlsFileName);
	}

	@Override
	public void finalize() {
		System.out.println("Garbage collected!");
	}
}
