
$(".showParticipants").click(async(e)=>{
    $("#selMaterial").val($(e.target).attr('material'));
    var myModal = new bootstrap.Modal(document.getElementById('ParticipantModal'), {});
    myModal.show();
});
$("#divisionSelect").change(async (e)=>{
    $(e.target).parent().submit();
});

$("#companySelect").change(async(e)=>{
    $(e.target).parent().submit();
});
var list;
var attachment;
function removeUpload(e,listFile){
    var li = $(e.target).parent();
    li.remove();
    for(var i=0;i<listFile.items.length;i++){
        if(listFile.files[i].name ==li.attr("name")){
            listFile.items.remove(listFile.files[i]);
        }
    }
}
var participantsModal = document.getElementById('ParticipantModal');
participantsModal.addEventListener('show.bs.modal', async function (event) {
    var table = $("#participantsTable");
    var res = await fetch("/material",{
        headers: {
            'Content-Type': 'application/json'
        },
        method:"POST",
        body:JSON.stringify({material:$("#selMaterial").val()})
    });
    if(res.ok){
        var obj = await res.json();
        $("#participantsTable tbody").empty();
        obj['participants'].data.forEach((i,indx)=>{
            $("#participantsTable tbody").append(`
            <tr>
            <th scope="row">${indx+1}</th>
            <td>${i.attributes.Name}</td>
            <td>${i.attributes.Company}</td>
            <td>${i.attributes.Division}</td>
            <td>${i.attributes.Email}</td>
            </tr>
            `);
        });
    }
});

var createModal = document.getElementById('CreateTopicModal')
createModal.addEventListener('show.bs.modal', function (event) {
    list = new DataTransfer();
    attachment = new DataTransfer();
    $("input[type!='hidden']").val("");
    $("#uploadedFile").empty();
    $('[data-toggle="datepicker"]').datepicker({
        });
        

    $("#modalCompanySelect").change(async(e)=>{
        var res = await fetch("/divisions",{
            headers: {
                'Content-Type': 'application/json'
            },
            method:"POST",
            body:JSON.stringify({company:e.target.value})
        });
        if(res.ok){
            var obj = await res.json();
            $("#modalDivisionSelect").empty();
            $("#modalDivisionSelect").append('<option  value="">Please select your division</option>');
            obj['divisions'].forEach((i)=>{
                $("#modalDivisionSelect").append(`<option  value="${i.id}">${i.attributes.Name}</option>`);
            });
        }
    });
    $("#formCreate").submit(async (event)=>{
        event.preventDefault();
        $('#loading').show();
        if($(event.target).serializeArray().filter((item)=>item.value=='').length>0){
            alert("Cek kembali data yang belum diisi!");
        }
        else if($('input#videoFile').prop('files').length<=0 || list.files.length<=0){
            alert("File yang dibutuhkan tidak lengkap!");
        }
        else{
            var obj = {};
            $(event.target).serializeArray().forEach(element => {
                try{
                    obj[element.name] = JSON.parse(element.value);
                }
                catch(e){
                    obj[element.name] = element.value;
                }
            });
            const formData = new FormData();
            formData.append('data', JSON.stringify(obj));
            for (let i = 0; i < list.files.length; i++) {
                const file = list.files[i];
                formData.append(`files.Images`, file, file.name);
            }
            for (let i = 0; i < attachment.files.length; i++) {
                const file = attachment.files[i];
                formData.append(`files.Attachments`, file, file.name);
            }
            formData.append(`files.Video`, $("#videoFile").prop('files')[0], $("#videoFile").prop('files')[0].name);

            const request = new XMLHttpRequest();
            request.onreadystatechange=function()
            {       
                if(request.readyState==4){
                    $('#loading').hide();
                }
                if(request.readyState==4 && request.status==200)
                {
                    location.reload();
                }
            }
            request.open('POST', $('#host').val()+"/api/materials");
            request.send(formData);

            // const response = await fetch($('#host').val()+"/api/saveMaterial", {
            //     method: 'POST', 
            //     headers: {
            //     'Content-Type': 'multipart/form-data'
            //     },
            //     body: formData // body data type must match "Content-Type" header
            // });
            // console.log(await response.json());
            // if(response.ok){
            //     var json = await response.json();
            //     $("#uploadMediaForm input[name='ref']").val('api::material.material');
            //     $("#uploadMediaForm input[name='refId']").val(json.id);
            //     $("#uploadMediaForm input[name='field']").val('Images');
            //     $("#uploadMediaForm input[name='files']").prop('files',list.files);
            //     var data = new FormData(document.getElementById('uploadMediaForm'));
            //     var upload = await fetch($('#host').val()+"/api/upload",{
            //         method: 'POST', 
            //         body:data
            //     });
            //     if(upload.ok){
            //         $("#uploadMediaForm input[name='field']").val('Attachments');
            //         $("#uploadMediaForm input[name='files']").prop('files',attachment.files);
            //         data = new FormData(document.getElementById('uploadMediaForm'));
            //         upload = await fetch($('#host').val()+"/api/upload",{
            //             method: 'POST', 
            //             body:data
            //         });
            //         if(upload.ok){
            //             $("#uploadMediaForm input[name='field']").val('Video');
            //             $("#uploadMediaForm input[name='files']").prop('files',$("#videoFile").prop('files'));
            //             data = new FormData(document.getElementById('uploadMediaForm'));
            //             upload = await fetch($('#host').val()+"/api/upload",{
            //                 method: 'POST', 
            //                 body:data
            //             });
            //             if(upload.ok){
            //                 location.reload(); 
            //             }
            //             else{
            //                 alert("Gagal mengupload video dokumentasi!");
            //             }
            //         }
            //         else{
            //             alert("Gagal mengupload materi dokumentasi!");
            //         }
            //     }
            //     else
            //     {
            //         alert("Gagal mengupload gambar thumbnail!");
            //         // console.log(await upload.json());
            //     }
            // }
            // else{
            //     // var res =await response.json();
            //     alert('Gagal membuat data dokumentasi material!');
            // }
        }
    });

    $("#formFile").change( (event) => {
        if(event.target.files.length>0){
            for(var i=0;i<event.target.files.length;i++){
                list.items.add(event.target.files[i]);
                $("#uploadedFile").append(
                    `<li name='${event.target.files[i].name}'>${event.target.files[i].name}
                        <button type="button" class="btn-close removeUpload" onclick="removeUpload(event,list)" aria-label="Close"></button>
                    </li>`
                );
            }
            $(event.target).val("");
        }
    });

    $("#formAttachment").change( (event) => {
        if(event.target.files.length>0){
            for(var i=0;i<event.target.files.length;i++){
                attachment.items.add(event.target.files[i]);
                $("#uploadedAttachment").append(
                    `<li name='${event.target.files[i].name}'>${event.target.files[i].name}
                        <button type="button" class="btn-close removeUpload" onclick="removeUpload(event,attachment)" aria-label="Close"></button>
                    </li>`
                );
            }
            $(event.target).val("");
        }
    });

    $("#join-form").change(async (event)=>{
        const file = event.target.files[0];
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        var aoa = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {header: 0});
        var container = document.getElementById('participantCounter');
        container.innerHTML = `${aoa.length} Participant(s)`;     
        $("input[name='ParticipantList']").val(JSON.stringify(aoa));   
    });
})
