var fs = require('fs');

exports.get_records = function () {
    XLSX = require('xlsx');
	
	var filesList = getFileList("./Mut_SRC");
    /*var workbook = XLSX.readFile('./test.xlsx');*/
    var count = 0;
	console.log(filesList);
	console.log(filesList.length);
	
	for (j = 0; j < filesList.length; j++) {
		
		var workbook = XLSX.readFile(filesList[j]);
		
		var sheet_name_list = workbook.SheetNames;
		console.log(sheet_name_list);
		
		var records = [];

		for (i = 1; i < sheet_name_list.length; i++) {
			var ws = workbook.Sheets[sheet_name_list[i]];
			try {
				var row = 1;
				while (!ws['A' + row] || ws['A' + row].v !== 'id') {
					row += 1;
				}
				var key_row = row;
				row++;

				var mutants = [];
				var id_re = /^[A-Z0-9 _]*$/;

				while (ws['A' + row] && id_re.exec(ws['A' + row].v) !== null) {
					var col = 'A';
					var mutant = {};

					while (ws[col + row] && ws[col + key_row] && ws[col + row].v != '') {
						mutant[ws[col + key_row].v] = ws[col + row].v;
						col = inc_col(col);

					}
					row++;
					/*console.log(count);
					count++;*/
					mutants.push(mutant);
				}
			} catch (e) {
				console.log(e);
				console.log(sheet_name_list[i]);
			}
			
			/*console.log(mutants);*/
			records.push(mutants);
			console.log('i = '+i+", j = "+j);
			console.log(mutants);
			console.log(sheet_name_list.length);
		}
	}
    return records;
};

function inc_col(char) {
    return String.fromCharCode(char.charCodeAt(0) + 1);
}

function getFileList(path) {
	var filesList = [];
	readFile(path,filesList);
	
	return filesList;
}

function readFile(path,filesList) {
	
	files = fs.readdirSync(path);
	files.forEach(walk);
	function walk(file) { 
		states = fs.statSync(path+'/'+file);   
		if(states.isDirectory()) {
			readFile(path+'/'+file,filesList);
		} else { 
			console.log(path+'/'+file);
			filesList.push(path+'/'+file);
		}  
	}
} 