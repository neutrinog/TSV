var fs = require('fs');
var path = require('path');
var tsv = require('../index');

var {
  TSV, CSV
} = tsv;

var tsv_data = fs.readFileSync(path.join(__dirname, 'test.tsv')).toString();
var csv_data = fs.readFileSync(path.join(__dirname, 'test.csv')).toString();
var json_data = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'test.json')).toString());
var json_4k = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'fb.json')).toString());

var ssv_data = fs.readFileSync(path.join(__dirname, 'headerless.ssv')).
  toString();
var json_ssv = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'headerless.json')).toString());

describe('TSV', () => {
  test('JSON to TSV', () => {
    expect(TSV.parse(TSV.stringify(json_data))).toEqual(json_data);
  });

  test('TSV to JSON', () => {
    expect(TSV.parse(tsv_data)).toEqual(json_data);
  });
});

describe('CSV', () => {
  test('JSON to CSV', () => {
    expect(CSV.parse(CSV.stringify(json_data))).toEqual(json_data);
  });

  test('CSV to JSON', () => {
    expect(CSV.parse(csv_data)).toEqual(json_data);
  });
});

describe('Options', () => {

  test('Star-separated file without header', () => {
    let SSV = new TSV.Parser('*', {header: false});
    expect(SSV.parse(ssv_data)).toEqual(json_ssv);

    SSV = new TSV.Parser('*');
    SSV.header = false;
    expect(SSV.parse(SSV.stringify(json_ssv))).toEqual(json_ssv);
  });

});

describe('Fail gracefully', () => {
  test('stringify', () => {
    expect(TSV.stringify({})).toEqual('');
    expect(TSV.stringify([])).toEqual('');
    expect(TSV.stringify(Number)).toEqual('');
    expect(TSV.stringify([1, 2, 3])).toEqual('');
  });

  test('parse', () => {
    expect(TSV.parse('')).toEqual([]);
    expect(TSV.parse('  ')).toEqual([]);
    expect(TSV.parse('blah blah')).toEqual([]);
  });
});

describe('Larger files', () => {
  test('4kb', () => {
    var tsv_4k = TSV.stringify(json_4k);
    expect(TSV.parse(tsv_4k)).toEqual(json_4k);
  });
});
