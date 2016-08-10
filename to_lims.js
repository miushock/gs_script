var csv = require('csv');
var fs = require('fs');

var snvFile = './SNV_RESULT.csv',
    cnvFile = './CNV_RESULT.csv',
    svFile = './SV_RESULT.csv';


function classify(mutant) {
    if (mutant['type'] === 'SNP') {
        if (mutant['Gene'] === 'GSTM1' || mutant['Gene'] === 'GSTT1' || (mutant['Gene'] === 'CYP2D6' && (mutant[AAChange] === null || mutant[AA.Change] === null))) {
            return 'CNV';
        } else
            return 'SNV';
    }

    if (mutant['type'] === 'Mutant' || mutant['type'] === 'Germline') {
        return 'SNV';
    }
	
    return mutant['type'];
}

function append(target, record) {
    fs.readFile(target, (err, data) => {
        csv.parse(data, (err, data) => {
            data = data.concat(record);
            csv.stringify(data, (err, data) => {
                fs.writeFile(target, data, (err) => {
                });
            });
        });
    });
}

function cnv_map(mutant) {
	
	var cnv_type;
	
	if (mutant['Gene'] === 'GSTM1' || mutant['Gene'] === 'GSTT1' || (mutant['Gene'] === 'CYP2D6' && (mutant[AAChange] === null || mutant[AA.Change] === null))) { 
		cnv_type = "双拷贝数缺失";
	} else {
		if (mutant['copy number'] > 1) {
			cnv_type = "基因扩增";
		} else if (mutant['copy number'] < 1){
			cnv_type = "单拷贝数缺失";
		} else {
			cnv_type = '';
		}
	}
    return ['', mutant['id'], '', '', mutant['Gene'], '', '', cnv_type, '', mutant['copy number'], mutant['type'], '', ''];
}

function snv_map(mutant) {
	
	if (mutant['AAChange'] != null) {
		var AABase = mutant["AAChange"].split(/[()]+/);
	} else {
		var AABase = "";
	}
	if (mutant['AA.Change'] != null) {
		var AABase = mutant["AA.Change"].split(/[()]+/);
	} else {
		var AABase = "";
	}
	if (mutant['Gene.ID'] != null) {
		var mutant_exon = mutant['Gene.ID'].split(':');
	} else {
		var mutant_exon = "";
	}
	
    return ['', mutant['id'], '', '', mutant['Gene'], '', '', mutant_exon[2], AABase[0], AABase[1], mutant['Ref'], mutant['Alt'], mutant['Chr.start'], mutant['Chr.end'], mutant['type'], mutant['ExonicFunc'], mutant['Hom.Het'], mutant['AF'], '', ''];
}

function sv_map(mutant) {
    return ['', mutant['id'], '', '', mutant['Gene'], '', mutant['Gene.ID']+' / '+mutant['AAChange'], '', mutant['Gene.ID']+' / '+mutant['AAChange'], '', '', mutant['Gene.ID']+' / '+mutant['AAChange'], mutant['Gene.ID']+' / '+mutant['AAChange'], mutant['Chr.start'], mutant['Chr.end'], mutant['type'], mutant['AF'], '', ''];
}

let snv_records = [];
let cnv_records = [];
let sv_records = [];

xform = require('./transform.js');
records = xform.get_records();
for (i = 0; i < records.length; i++) {
    for (j = 0; j < records[i].length; j++) {
        console.log(records[i][j]);
        mutant = records[i][j];
        if (classify(mutant) === 'SNV') {
            snv_records.push(snv_map(mutant));
        }
        if (classify(mutant) === 'CNV') {
            cnv_records.push(cnv_map(mutant));
        }
        if (classify(mutant) === 'SV') {
            sv_records.push(sv_map(mutant));
        }
    }
}

append(snvFile, snv_records);
append(cnvFile, cnv_records);
append(svFile, sv_records);
