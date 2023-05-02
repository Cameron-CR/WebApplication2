var files = JSON.parse(localStorage.getItem('files')) || [];
var fileRename = " "



document.addEventListener('DOMContentLoaded', function () {
    var files = [];
    
    
    document.getElementById('getInput').addEventListener('click', function () {
        document.getElementById('fileInput').click();
    });

    getInput.addEventListener('dragover', function (e) {
        e.preventDefault();
    });


    getInput.addEventListener('drop', function (event) {
        event.preventDefault();
        event.stopPropagation();

        var fileList = event.dataTransfer.files;

        fileInput.files = fileList;
        fileInput.dispatchEvent(new Event('change'));
    });

    function getFileType() {
        var fileTypeSelect = document.getElementById('file-type-select');
        return fileTypeSelect.value;
    }

    document.getElementById('fileInput').addEventListener('change', function () {

        for (var i = 0; i < this.files.length; i++) {
            var file = this.files[i];
            var fileName = file.name;
            var fileType = document.getElementById('file-type').value;
            fileName = fileName.replace(/\.[^/.]+$/, '') + '.' + fileType;
            var fileSize = (file.size / (1024 * 1024)).toFixed(2).toString();
            var fileObj = { file: file, fileName: fileName, fileSize: fileSize };

            var reader = new FileReader();
            reader.onload = function (event) {
                var base64String = event.target.result.split(',')[1];
                var fileObj = { file: base64String, fileName: fileName, fileSize: fileSize };
                files.push(fileObj);
                localStorage.setItem('files', JSON.stringify(files));
            };
            reader.readAsDataURL(file);

            
            var readyFileContainer = document.createElement('div');
            readyFileContainer.classList.add('ready-file');

            
            var fileNameDiv = document.createElement('div');
            fileNameDiv.classList.add('file-name');
            var fileNamePara = document.createElement('p');
            fileNamePara.textContent = fileName;
            fileNameDiv.appendChild(fileNamePara);

            var fileSizeDiv = document.createElement('div');
            fileSizeDiv.classList.add('file-size');
            var fileSizePara = document.createElement('p');
            fileSizePara.textContent = fileSize + ' MB';
            fileSizeDiv.appendChild(fileSizePara);

            
            var convertBtn = document.createElement('button');
            convertBtn.type = 'submit';
            convertBtn.classList.add('btn', 'btn-primary');
            convertBtn.textContent = 'Convert File';
            fileSizeDiv.appendChild(convertBtn);

            var fileReadyMenu = document.createElement('i');
            fileReadyMenu.classList.add('fa-solid', 'fa-ellipsis-vertical', 'file-ready-menu');


            fileSizeDiv.appendChild(fileReadyMenu);

            fileReadyMenu.addEventListener('mouseover', function (event) {
                event.stopPropagation(); 

                var iconRect = event.target.getBoundingClientRect(); 

                var dropdown = fileSizeDiv.querySelector('.file-ready-dropdown');
                dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';

                
                dropdown.style.top = (iconRect.top + iconRect.height) + 'px';
                dropdown.style.left = iconRect.left + 'px';
            });


            readyFileContainer.appendChild(fileNameDiv);
            readyFileContainer.appendChild(fileSizeDiv);

            var fileReadyDropdown = document.createElement('div');
            fileReadyDropdown.classList.add('file-ready-dropdown');

            var setParamTab = document.createElement('a');
            setParamTab.textContent = 'Set New Parameter';
            setParamTab.href = '#';
            fileReadyDropdown.appendChild(setParamTab);

            var convertAgainTab = document.createElement('a');
            convertAgainTab.textContent = 'Convert Again';
            convertAgainTab.href = '#';
            fileReadyDropdown.appendChild(convertAgainTab);

            var renameTab = document.createElement('a');
            renameTab.textContent = 'Rename File';
            renameTab.href = '#';
            fileReadyDropdown.appendChild(renameTab);

            var deleteTab = document.createElement('a');
            deleteTab.textContent = 'Delete';
            deleteTab.href = '#';
            fileReadyDropdown.appendChild(deleteTab);

            fileSizeDiv.appendChild(fileReadyDropdown);
            
            var filesReadyForDownload = document.querySelector('.files-readyFor-download');
            filesReadyForDownload.appendChild(readyFileContainer);

            
            convertBtn.addEventListener('click', function () {
                
                convertBtn.textContent = 'File Converted';
                convertBtn.style.background = '#f72d7a';
                convertBtn.disabled = true;

               
                convertFile(fileObj, false, fileRename)
            });

            var fileNamePara = fileNameDiv.querySelector('p');

            fileNamePara.addEventListener('click', function () {
                var fileName = fileNamePara.textContent;
                fileNamePara.textContent = '';

                var renameInput = document.createElement('input');
                renameInput.type = 'text';
                renameInput.classList.add('rename-input');
                renameInput.value = fileName;
                fileNamePara.appendChild(renameInput);
                renameInput.focus();

                var saveBtn = document.createElement('button');
                saveBtn.type = 'submit';
                saveBtn.classList.add('btn', 'btn-primary');
                saveBtn.textContent = 'Save';
                fileSizeDiv.replaceChild(saveBtn, convertBtn);

                saveBtn.addEventListener('click', function () {
                    var newFileName = renameInput.value;
                    fileNamePara.textContent = newFileName;
                    fileRename = newFileName;

                    for (var i = 0; i < files.length; i++) {
                        if (files[i].fileName === fileName) {
                            files[i].fileName = newFileName;
                            localStorage.setItem('files', JSON.stringify(files));
                            break;
                        }
                    }

                    fileSizeDiv.replaceChild(convertBtn, saveBtn);
                    convertBtn.disabled = false;
                    convertBtn.textContent = 'Convert File';
                });
            })

            renameTab.addEventListener('click', function () {
                var fileNamePara = fileNameDiv.querySelector('p');
                var fileName = fileNamePara.textContent;
                fileNamePara.textContent = '';

                var renameInput = document.createElement('input');
                renameInput.type = 'text';
                renameInput.classList.add('rename-input');
                renameInput.value = fileName;
                fileNamePara.appendChild(renameInput);
                renameInput.focus();

                var saveBtn = document.createElement('button');
                saveBtn.type = 'submit';
                saveBtn.classList.add('btn', 'btn-primary');
                saveBtn.textContent = 'Save';
                fileSizeDiv.replaceChild(saveBtn, convertBtn);

                saveBtn.addEventListener('click', function () {
                    var newFileName = renameInput.value;
                    fileNamePara.textContent = newFileName;
                    fileRename = newFileName;

                    for (var i = 0; i < files.length; i++) {
                        if (files[i].fileName === fileName) {
                            files[i].fileName = newFileName;
                            localStorage.setItem('files', JSON.stringify(files));
                            break;
                        }
                    }

                    fileSizeDiv.replaceChild(convertBtn, saveBtn);
                    convertBtn.disabled = false;
                    convertBtn.textContent = 'Convert File';
                });
            });



            deleteTab.addEventListener('click', function () {

                readyFileContainer.remove();

                var fileName = fileObj.fileName;
                var fileSize = fileObj.fileSize;
                files = files.filter(function (obj) {
                    return obj.fileName !== fileName || obj.fileSize !== fileSize;
                });
                localStorage.setItem('files', JSON.stringify(files));
            });

            convertAgainTab.addEventListener('click', function () {
                convertBtn.disabled = false;
                convertBtn.textContent = 'Convert File';
            });

            document.getElementById('convertAll').addEventListener('click', function () {
                var convertBtns = document.querySelectorAll('.btn');
                for (var i = 0; i < convertBtns.length; i++) {
                    var convertBtn = convertBtns[i];
                    convertBtn.textContent = 'File Converted';
                    convertBtn.style.background = '#f72d7a';
                    convertBtn.disabled = true;
                    var event = new Event('click');
                    convertBtn.dispatchEvent(event);
                }
            });


        }

        
    });


    
    window.addEventListener('load', function () {
        files = JSON.parse(localStorage.getItem('files')) || [];
        fileHistoryList = JSON.parse(localStorage.getItem('fileHistoryList')) || [];

        var fileMetadata = JSON.parse(localStorage.getItem('fileMetadata'));

        if (fileMetadata) {
            
            var file = new File([], fileMetadata.fileName, { type: fileMetadata.fileType });
            var fileObj = { file: file, fileName: fileMetadata.fileName };

            
            convertFile(fileObj, false, fileRename);
        }

        createFileContainer(fileObj, false, fileRename);

        var appendedFileNames = [];

        var fileHistoryList = getFileHistoryList();
        fileHistoryList.forEach(function (fileObj) {
            if (!appendedFileNames.includes(fileObj.fileName)) {
                appendToFileHistory(fileObj, fileRename);
                appendedFileNames.push(fileObj.fileName);
            }
        });

        localStorage.setItem('fileHistoryList', JSON.stringify(fileHistoryList));
    });


    function createFileContainer(file, downloadFromServer, rename) {
        files.forEach(function (fileObj) {
            var readyFileContainer = document.createElement('div');
            readyFileContainer.classList.add('ready-file');

            var fileNameDiv = document.createElement('div');
            fileNameDiv.classList.add('file-name');
            var fileNamePara = document.createElement('p');
            fileNamePara.textContent = fileObj.fileName;
            fileNameDiv.appendChild(fileNamePara);

            var fileSizeDiv = document.createElement('div');
            fileSizeDiv.classList.add('file-size');
            var fileSizePara = document.createElement('p');
            fileSizePara.textContent = fileObj.fileSize + ' MB';
            fileSizeDiv.appendChild(fileSizePara);


            var convertBtn = document.createElement('button');
            convertBtn.type = 'submit';
            convertBtn.classList.add('btn', 'btn-primary');
            convertBtn.textContent = 'Convert File';
            fileSizeDiv.appendChild(convertBtn);

            var fileReadyMenu = document.createElement('i');
            fileReadyMenu.classList.add('fa-solid', 'fa-ellipsis-vertical', 'file-ready-menu');

            fileReadyMenu.addEventListener('mouseover', function (event) {
                event.stopPropagation();

                var iconRect = event.target.getBoundingClientRect();

                var dropdown = fileSizeDiv.querySelector('.file-ready-dropdown');
                dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';


                dropdown.style.top = (iconRect.top + iconRect.height) + 'px';
                dropdown.style.left = iconRect.left + 'px';

            });


            var fileReadyDropdown = document.createElement('div');
            fileReadyDropdown.classList.add('file-ready-dropdown');

            var setParamTab = document.createElement('a');
            setParamTab.textContent = 'Set New Parameter';
            setParamTab.href = '#';
            fileReadyDropdown.appendChild(setParamTab);

            var convertAgainTab = document.createElement('a');
            convertAgainTab.textContent = 'Convert Again';
            convertAgainTab.href = '#';
            fileReadyDropdown.appendChild(convertAgainTab);

            var renameTab = document.createElement('a');
            renameTab.textContent = 'Rename File';
            renameTab.href = '#';
            fileReadyDropdown.appendChild(renameTab);

            var deleteTab = document.createElement('a');
            deleteTab.textContent = 'Delete';
            deleteTab.href = '#';
            fileReadyDropdown.appendChild(deleteTab);

            fileSizeDiv.appendChild(fileReadyDropdown);

            fileSizeDiv.appendChild(fileReadyMenu);

            readyFileContainer.appendChild(fileNameDiv);
            readyFileContainer.appendChild(fileSizeDiv);

            var filesReadyForDownload = document.querySelector('.files-readyFor-download');
            filesReadyForDownload.appendChild(readyFileContainer);


            convertBtn.addEventListener('click', function () {
                convertBtn.textContent = 'File Converted';
                convertBtn.style.background = '#f72d7a';
                convertBtn.disabled = true;


                var formData = new FormData();
                formData.append('file', fileObj.file);

                fetch('/upload', {
                    method: 'POST',
                    body: formData
                })
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        
                        console.log(data);
                    })
                    .catch(function (error) {
                        console.error(error);
                    })
            });
            var fileNamePara = fileNameDiv.querySelector('p');

            fileNamePara.addEventListener('click', function () {
                fileNamePara = fileNameDiv.querySelector('p');
                var fileName = fileNamePara.textContent;
                fileNamePara.textContent = '';

                var renameInput = document.createElement('input');
                renameInput.type = 'text';
                renameInput.classList.add('rename-input');
                renameInput.value = fileName;
                fileNamePara.appendChild(renameInput);
                renameInput.focus();

                var saveBtn = document.createElement('button');
                saveBtn.type = 'submit';
                saveBtn.classList.add('btn', 'btn-primary');
                saveBtn.textContent = 'Save';
                fileSizeDiv.replaceChild(saveBtn, convertBtn);

                saveBtn.addEventListener('click', function () {
                    var newFileName = renameInput.value;
                    fileNamePara.textContent = newFileName;
                    fileRename = newFileName;

                    for (var i = 0; i < files.length; i++) {
                        if (files[i].fileName === fileName) {
                            files[i].fileName = newFileName;
                            localStorage.setItem('files', JSON.stringify(files));
                            break;
                        }
                    }

                    fileSizeDiv.replaceChild(convertBtn, saveBtn);
                    convertBtn.disabled = false;
                    convertBtn.textContent = 'Convert File';
                });
            })

            renameTab.addEventListener('click', function () {
                fileNamePara = fileNameDiv.querySelector('p');
                var fileName = fileNamePara.textContent;
                fileNamePara.textContent = '';

                var renameInput = document.createElement('input');
                renameInput.type = 'text';
                renameInput.classList.add('rename-input');
                renameInput.value = fileName;
                fileNamePara.appendChild(renameInput);
                renameInput.focus();

                var saveBtn = document.createElement('button');
                saveBtn.type = 'submit';
                saveBtn.classList.add('btn', 'btn-primary'); 
                saveBtn.textContent = 'Save';
                fileSizeDiv.replaceChild(saveBtn, convertBtn);

                saveBtn.addEventListener('click', function () {
                    var newFileName = renameInput.value;
                    fileNamePara.textContent = newFileName;

                    for (var i = 0; i < files.length; i++) {
                        if (files[i].fileName === fileName) {
                            files[i].fileName = newFileName;
                            localStorage.setItem('files', JSON.stringify(files));
                            break;
                        }
                    }

                    fileSizeDiv.replaceChild(convertBtn, saveBtn);
                    convertBtn.disabled = false;
                    convertBtn.textContent = 'Convert File';
                });
            });


            deleteTab.addEventListener('click', function () {

                readyFileContainer.remove();


                var fileName = fileObj.fileName;
                var fileSize = fileObj.fileSize;
                files = files.filter(function (obj) {
                    return obj.fileName !== fileName || obj.fileSize !== fileSize;
                });
                localStorage.setItem('files', JSON.stringify(files));
            });

            convertAgainTab.addEventListener('click', function () {
                convertBtn.disabled = false;
                convertBtn.textContent = 'Convert File';

                convertFile(file, downloadFromServer, rename)
            });
        });


    }



    function convertFile(fileObj, downloadFromServer, renamed) {
       
        var fileMetadata = { fileName: fileObj.fileName, fileType: fileObj.file.type };
        localStorage.setItem('fileMetadata', JSON.stringify(fileMetadata));

        var fileType = getFileHistoryList();

        setTimeout(function () {
            var convertBtn = document.querySelector('.btn-primary[disabled]');
            convertBtn.textContent = 'Convert File';
            convertBtn.disabled = false;

            if (downloadFromServer) {
                // download the file from the server
                var xhr = new XMLHttpRequest();
                xhr.open('GET', '/Download?fileName=' + fileObj.fileName, true);
                xhr.responseType = 'blob';

                xhr.onload = function () {
                    // Save modified file to IndexedDB
                    var db;
                    var request = indexedDB.open('modifiedFilesDB', 1);
                    request.onerror = function (event) {
                        console.log('Failed to open modifiedFilesDB');
                    };
                    request.onsuccess = function (event) {
                        db = event.target.result;
                        var transaction = db.transaction(['modifiedFiles'], 'readwrite');
                        var objectStore = transaction.objectStore('modifiedFiles');
                        var modifiedBlob = new Blob([xhr.response], { type: 'text/csv' });
                        var modifiedFileObj = { file: modifiedBlob, fileName: 'modified_' + fileObj.fileName, fileSize: (modifiedBlob.size / (1024 * 1024)).toFixed(2).toString() };
                        var request = objectStore.add(modifiedFileObj);
                        request.onerror = function (event) {
                            console.log('Failed to add modified file to IndexedDB');
                        };
                        request.onsuccess = function (event) {
                            console.log('Modified file added to IndexedDB');
                        };
                    };

                    var downloadAnchor = document.createElement('a');
                    downloadAnchor.href = window.URL.createObjectURL(xhr.response);
                    downloadAnchor.download = fileObj.fileName;
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    document.body.removeChild(downloadAnchor);

                    convertBtn.textContent = 'File Converted';
                    convertBtn.disabled = true;
                };

                xhr.send();
            } else {

                var selectedParamId = document.getElementById("parameter-type").value;
                var parameters = JSON.parse(localStorage.getItem("parameters"));
                var selectedParams = parameters.find(function (param) {
                    return param.id === selectedParamId;
                });


                var reader = new FileReader();
                //reader.onload = function () {
                //    var contents = reader.result;

                //    contents = contents.replace(/(?<!\.)\b0\b/g, selectedParams.param1);
                //    contents = contents.replace(/(?<![.\d])0(?!\.\d)|(?<![.\d])\d+\.\d+|\d+/g, function (match) {
                //        if (match === selectedParams.value1) {
                //            return selectedParams.param2;
                //        } else {
                //            return selectedParams.param2;
                //        }
                //    });



                    reader.onload = function () {
                        var contents = reader.result;
                        contents = contents.replace(/(?<!\.)\b0\b/g, selectedParams.param1);
                        contents = contents.replace(/(?<![.\d])0(?!\.\d)|(?<![.\d])\d+\.\d+|\d+/g, function (match) {
                            switch (selectedParams.conditionalValue1) {
                                case 'lessThan':
                                    if (match < selectedParams.value1) {
                                        return selectedParams.param1;
                                    } else {
                                        return selectedParams.param2;
                                    }
                                    break;
                                case 'greaterThan':
                                    if (match > selectedParams.value1) {
                                        return selectedParams.param1;
                                    } else {
                                        return selectedParams.param2;
                                    }
                                    break;
                                case 'lessOrEqual':
                                    if (match <= selectedParams.value1) {
                                        return selectedParams.param1;
                                    } else {
                                        return selectedParams.param2;
                                    }
                                    break;
                                case 'greaterOrEqual':
                                    if (match >= selectedParams.value1) {
                                        return selectedParams.param1;
                                    } else {
                                        return selectedParams.param2;
                                    }
                                    break;
                                case 'equal':
                                    if (match == selectedParams.value1) {
                                        return selectedParams.param1;
                                    } else {
                                        return selectedParams.param2;
                                    }
                                    break;
                                default:
                                    return match;

                            }
                        });

                        
                    







                    var db;
                    var request = indexedDB.open('modifiedFilesDB', 2);
                    request.onupgradeneeded = function (event) {
                        db = event.target.result;
                        if (!db.objectStoreNames.contains('modifiedFiles')) {
                            db.createObjectStore('modifiedFiles', { keyPath: 'id', autoIncrement: true });
                        }
                    };
                    request.onsuccess = function (event) {
                        db = event.target.result;
                        var transaction = db.transaction(['modifiedFiles'], 'readwrite');
                        var objectStore = transaction.objectStore('modifiedFiles');
                        var modifiedBlob = new Blob([contents], { type: 'text/' + fileType });
                        var modifiedFileObj = { file: modifiedBlob, fileName: 'modified_' + fileObj.fileName, fileSize: (modifiedBlob.size / (1024 * 1024)).toFixed(2).toString() };
                        var request = objectStore.add(modifiedFileObj);
                        request.onerror = function (event) {
                            console.log('Failed to add modified file to IndexedDB');
                        };
                        request.onsuccess = function (event) {
                            console.log('Modified file added to IndexedDB');
                        };
                    };


                    var modifiedBlob = new Blob([contents], { type: 'text/csv' });

                    if (renamed == " ") {
                        var modifiedFileName = 'modified_' + fileObj.fileName;
                    } else {
                        var modifiedFileName = 'modified_' + renamed;
                    }


                    var downloadAnchor = document.createElement('a');
                    downloadAnchor.href = window.URL.createObjectURL(modifiedBlob);
                    downloadAnchor.download = modifiedFileName;
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    document.body.removeChild(downloadAnchor);
                    convertBtn.textContent = 'File Converted';
                    convertBtn.disabled = true;


                }
                reader.readAsText(fileObj.file);
            }

            appendToFileHistory(fileObj, renamed);
        

        }, 1000);

    }


    var dropdown = document.querySelector(".dropdown");


    dropdown.addEventListener("mouseover", function () {
        var dropdownContent = this.querySelector(".dropdown-content");
        dropdownContent.style.display = "block";
    });

    dropdown.addEventListener("mouseout", function () {
        var dropdownContent = this.querySelector(".dropdown-content");
        dropdownContent.style.display = "none";
    });

    var deleteAllLink = document.getElementById("deleteAll");

    deleteAllLink.addEventListener("click", function (event) {
        event.preventDefault();
        

        if (localStorage.getItem("files") === null) {

            alert("There are no files to delete.");
        } else {

            localStorage.removeItem("files");


            alert("All files have been deleted.");


            location.reload();
        }
    });

    window.onload = function () {
        var dropdownFileHistory = document.querySelector(".history-dropdown");

        dropdownFileHistory.addEventListener("mouseover", function () {
            this.querySelector(".file-history-dropdown-content").style.display = "block";
        });

        dropdownFileHistory.addEventListener("mouseout", function () {
            var dropdownHistoryContent = this.querySelector(".file-history-dropdown-content");
            dropdownHistoryContent.style.display = "none";
        });

        var deleteAllHistoryLink = document.getElementById("deleteAllHistory");

        deleteAllHistoryLink.addEventListener("click", function (event) {
            event.preventDefault();

            if (localStorage.getItem("fileHistoryList") === null) {
                alert("There are no files to delete.");
            } else {
                localStorage.removeItem("fileHistoryList");
                localStorage.removeItem("fileMetadata");
                alert("All files have been deleted.");
                location.reload();
            }
        });
    };

    const starIcon = document.getElementById("star-icon");

    



    







    function appendToFileHistory(fileObj, renamed) {

        var fileHistory = document.querySelector('.file-history');
        var fileHistoryDownload = document.querySelector('.file-history-download');
        var historyFileContainer = fileHistoryDownload.cloneNode(true);

        var fileNamePara = historyFileContainer.querySelector('.history-file-name');

        if (renamed === " ") {
            fileNamePara.textContent = fileObj.fileName;
        } else {
            fileNamePara.textContent = renamed;
        }

        fileHistory.insertBefore(historyFileContainer, fileHistoryDownload.nextSibling);

        var fileHistoryList = getFileHistoryList();

        if (renamed === " ") {
            fileHistoryList.push({ file: fileObj.file, fileName: fileObj.fileName });
        } else {
            fileHistoryList.push({ file: fileObj.file, fileName: renamed });
        }

        localStorage.setItem('fileHistoryList', JSON.stringify(fileHistoryList));

        //document.querySelector('.download-file-history').addEventListener('click', function () {
        //    downloadFromDB(fileObj.fileName)
        //});
    }



    
    function getFileHistoryList() {
        var fileHistoryList = localStorage.getItem('fileHistoryList');
        if (fileHistoryList) {
            return JSON.parse(fileHistoryList);
        } else {
            return [];
        }
    }

    function getFileList() {
        var fileList = localStorage.getItem('files');
        if (fileList) {
            return JSON.parse(fileList);
        } else {
            return [];
        }
    }

    document.getElementById("home").addEventListener('click', function () {
        event.preventDefault(); 
        window.location.href = "/LoginRegister/LoginRegisterPage";
    })

    document.getElementById("logout").addEventListener('click', function () {
        event.preventDefault();
        window.location.href = "/LoginRegister/LoginRegisterPage";
    })

    var username = localStorage.getItem("username", username);
    var email = localStorage.getItem("email", email);

    document.querySelector('.user-name').textContent = `Welcome, ${username}`
    document.querySelector('.user-email').textContent = email


    var modal = document.getElementById("myModal");


    var btn = document.getElementById("setParameters");


    var span = document.getElementsByClassName("close")[0];

 
    btn.onclick = function () {
        modal.style.display = "block";
    }

    
    span.onclick = function () {
        modal.style.display = "none";
    }

    
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    document.getElementById("viewParameters").addEventListener('click', function () {
        document.getElementById("myModalView").style.display = "block"

        var select = document.getElementById("parameter-type-view");


        var parameters = JSON.parse(localStorage.getItem("parameters"));


        for (var i = 0; i < parameters.length; i++) {
            var option = document.createElement("option");
            option.text = parameters[i].id;
            option.value = parameters[i].id;
            select.add(option);
        }
    })

    //var selectedParamId = document.getElementById("parameter-type-view").value;
    //var parameters = JSON.parse(localStorage.getItem("parameters"));
    //var selectedParamsView = parameters.find(function (param) {
    //    return param.id === selectedParamId;
   /* });*/


    
    
    document.getElementById("saveParameters").onclick = function () {
        
        var parameters = JSON.parse(localStorage.getItem("parameters")) || [];

        
        var paramObj = {
            id: document.getElementById("paramName").value,
            value1: document.getElementById("value1").value,
            value2: document.getElementById("value2").value,
            param1: document.getElementById("param1").value,
            param2: document.getElementById("param2").value,
            conditionalValue1: document.querySelector(".conditional-type-value1").value,
            conditionalValue2: document.querySelector(".conditional-type-value2").value
        };

        
        parameters.push(paramObj);

        
        localStorage.setItem("parameters", JSON.stringify(parameters));
   
        modal.style.display = "none";

        alert(`Parameter set ${paramObj.id} saved`)

        location.reload();
    }

    
    var select = document.getElementById("parameter-type");

    
    var parameters = JSON.parse(localStorage.getItem("parameters"));

    
    for (var i = 0; i < parameters.length; i++) {
        var option = document.createElement("option");
        option.text = parameters[i].id;
        option.value = parameters[i].id;
        select.add(option);
    }


});


function downloadFromDB(fileName) {
    var request = indexedDB.open('modifiedFilesDB', 2);
    request.onsuccess = function (event) {
        var db = event.target.result;
        var transaction = db.transaction(['modifiedFiles'], 'readonly');
        var objectStore = transaction.objectStore('modifiedFiles');

        var getRequest = objectStore.get(fileName);
        getRequest.onsuccess = function (event) {
            var file = event.target.result.file;

            var reader = new FileReader();
            reader.onload = function () {
                var url = URL.createObjectURL(file);

                var downloadAnchor = document.createElement('a');
                downloadAnchor.href = url;
                downloadAnchor.download = fileName;
                downloadAnchor.style.display = 'none';
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                document.body.removeChild(downloadAnchor);

                URL.revokeObjectURL(url);
            };
            reader.readAsArrayBuffer(file);
        };
    };

   
}


















