import csv;


with open("Player.csv", 'r') as infile, open("Player_cleaned.csv", 'w') as outfile: 
    # creating a csv reader object 
    csvreader = csv.reader(infile) 
    csvwriter = csv.writer(outfile)
    new_rows = []
    for row in csvreader:
    	count = 0;
    	temp_row = []
    	for col in row:
    		if(count == 3):
    			print(col)
    			col = col.replace("-","/");
    			print(col)
    		count +=1
    		temp_row += [col]
    	new_rows += [temp_row]
    csvwriter.writerows(new_rows);
  	 