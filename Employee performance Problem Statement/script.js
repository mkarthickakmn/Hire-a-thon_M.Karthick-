
let selectedFile;
document.getElementById('input').addEventListener("change", (event) => {
    selectedFile = event.target.files[0];
})

let data = [];

document.getElementById('finalOutput').innerHTML = "";
document.getElementById('button').addEventListener("click", () => {
    XLSX.utils.json_to_sheet(data, 'out.xlsx');
    if (selectedFile) {
        let fileReader = new FileReader();
        fileReader.readAsBinaryString(selectedFile);
        fileReader.onload = (event) => {
            let data = event.target.result;
            let workbook = XLSX.read(data, { type: "binary" });
            console.log(workbook);
            workbook.SheetNames.forEach(sheet => {
                let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
                console.log(rowObject);
                document.getElementById('finalOutput').innerHTML = "<h3>1. Mean effort spent by various teams on different Projects:<h3><br>";
                
                function groupBy(objectArray, property) {
                    return objectArray.reduce((acc, obj) => {
                        const key = obj[property].trim();
                        if (!acc[key]) {
                            acc[key] = [];
                        }
                        // Add object to list for given key's value
                        acc[key].push(obj);
                        return acc;
                    }, {});
                }
                const groupedTeam = groupBy(rowObject, 'Team');
                let finalJson = {};
                for (let x in groupedTeam) {
                    finalJson[x] = groupBy(groupedTeam[x], 'Project Name');
                }
                let teamName = "";
                for (let x in finalJson) {
                    teamName = "Team  " + x + " - ";
                    project(finalJson[x], x);
                }

                function project(obj, projectName) {
                    for (let x in obj) {
                        let sum = obj[x].reduce((a, b) => a + b['Hours'], 0)
                        let average = sum / obj[x].length;
                        let str = (x + " - " + average + "\n");
                        console.log(teamName + str);
                        document.getElementById('finalOutput').innerHTML += teamName + str + 'hrs <br>';

                    }
                }

            });
        }
    }
    else
    {
        alert('Please upload the excel file!');
    }
});



