$(".removeMaterial").click(async(e)=>{
    var el = $(e.target).find('[material]').length == 0?$(e.target).closest('[material]'):$(e.target).find('[material]');
    if(confirm("delete this material?")){
        $("#loading").show();
        var res = await fetch($('#host').val()+"/api/materials/"+el.attr('material'),{
            method:"DELETE",
        });
        if(res.ok){
            location.reload();
        }
        else{
            $("#loading").hide();
            alert("Tidak dapat menghapus materi. Terjadi kesalahan!");
        }
    }
});

$(".editMaterial").click(async(e)=>{
    var el = $(e.target).find('[material]').length == 0?$(e.target).closest('[material]'):$(e.target).find('[material]');
    $("#selMaterial").val(el.attr('material'));
    var myModal = new bootstrap.Modal(document.getElementById('CreateTopicModal'), {});
    $("#CreateTopicModal").attr('operation','edit');
    myModal.show();
});

$(".showParticipants").click(async(e)=>{
    $("#selMaterial").val($(e.target).closest('[material]').attr('material'));
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
var removeMedia = [];
function removeUpload(e,listFile){
    var li = $(e.target).parent();
    if(li.attr('status')=='uploaded') removeMedia.push(li.val());
    else{
        for(var i=0;i<listFile.items.length;i++){
            // console.log(listFile.files[i].name.replace(/["']/g, ""),li.attr("name"),listFile.files[i].name.replace(/["']/g, "") ==li.attr("name"));
            if(listFile.files[i].name.replace(/["']/g, "") ==li.attr("name")){
                // console.log("deleting ",listFile.files[i]);
                listFile.items.remove(i);
            }
        }
    }
    // console.log(listFile.files,attachment.files);
    li.remove();
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

var createModal = document.getElementById('CreateTopicModal');

createModal.addEventListener('hidden.bs.modal', function (event){
    $("#CreateTopicModal").attr('operation','');
    $("#uploadedAttachment").empty();
    $("#uploadedFile").empty();
    $("#videoSelected").remove();
});
createModal.addEventListener('show.bs.modal', async function (event) {
    removeMedia = [];
    var materialData;
    
    $("#CreateTopicModal input[type!='hidden']").val("");
    $("#CreateTopicModal select").val("");
    $("#CreateTopicModal textarea").html('');
    $("#CreateTopicModal textarea").val('');
    var container = document.getElementById('participantCounter');
    container.innerHTML = '';     
    $("#CreateTopicModal input[name='ParticipantList']").val("");   
    list = new DataTransfer();
    attachment = new DataTransfer();
    
    $("#uploadedFile").empty();
    $('[data-toggle="datepicker"]').datepicker({
        });
    if($("#CreateTopicModal").attr('operation')=='edit'){
        $('#loading').show();
        var res = await fetch("/material",{
            headers: {
                'Content-Type': 'application/json'
            },
            method:"POST",
            body:JSON.stringify({material:$("#selMaterial").val()})
        });
        if(res.ok){
            try{
                var obj = await res.json();
                materialData = obj;
                Object.keys(obj).forEach(async (i)=>{
                    if(typeof obj[i] === 'object'&& !(obj[i].data instanceof Array)){
                        if(!obj[i].data.attributes.mime){
                            $(`[name='${i}']`).val(obj[i].data.id);
                            if(i=='company'){
                                var res = await fetch("/divisions",{
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    method:"POST",
                                    body:JSON.stringify({company:obj[i].data.id})
                                });
                                if(res.ok){
                                    var resp = await res.json();
                                    $("#modalDivisionSelect").empty();
                                    $("#modalDivisionSelect").append('<option value="">Please select your division</option>');
                                    resp['divisions'].forEach((item)=>{
                                        $("#modalDivisionSelect").append(`<option ${(item.id==obj['division'].data.id)?'selected':''} value="${item.id}">${item.attributes.Name}</option>`);
                                    });
                                    $("#modalDivisionSelect").removeAttr('disabled');
                                }
                            }
                        }
                        else{
                            $( "input#videoFile" ).after( `<small id="videoSelected">current video : ${obj[i].data.attributes.name}</small>` );
                        }
                    }
                    else {
                        if(obj[i].data instanceof Array){
                            if(i=='participants'){
                                var aoa = obj[i].data.map((o)=>o.attributes);
                                var container = document.getElementById('participantCounter');
                                container.innerHTML = `${aoa.length} Participant(s)`;     
                                $("input[name='ParticipantList']").val(JSON.stringify(aoa));   
                            }
                            else if(i=='Images'){
                                obj[i].data.forEach(async(thumbnails)=>{
                                    $("#uploadedFile").append(
                                        `<li status='uploaded' value='${thumbnails.id}' name='${thumbnails.attributes.name.replace(/["']/g, "")}'>${thumbnails.attributes.name}
                                            <button type="button" class="btn-close removeUpload" onclick="removeUpload(event,list)" aria-label="Close"></button>
                                        </li>`
                                    );
                                });
                            }
                            else if(i=='Attachments'){
                                obj[i].data.forEach(async(attachments)=>{
                                    $("#uploadedAttachment").append(
                                        `<li status='uploaded' value='${attachments.id}' name="${attachments.attributes.name.replace(/["']/g, "")}">${attachments.attributes.name}
                                            <button type="button" class="btn-close removeUpload" onclick="removeUpload(event,attachment)" aria-label="Close"></button>
                                        </li>`
                                    );
                                });
                            }
                        } 
                        else $(`[name='${i}']`).val(obj[i]);
                    }
                });
            }
            catch(e){
                $('#loading').hide();
                console.log(e);
            }
        }
        else{
            alert("Something wrong when loading data!");
        }
        $('#loading').hide();
    }
    
    $("#modalCompanySelect").change(async(e)=>{
        if(e.target.value&&e.target.value!=''){
            $("#modalDivisionSelect").removeAttr('disabled');
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
        }
        else {
            $("#modalDivisionSelect").attr('disabled','disabled');
        }
    });
    $("#formCreate").submit(async (event)=>{
        event.preventDefault();
        if($("#CreateTopicModal").attr('operation')=='edit'){
            if($(event.target).serializeArray().filter((item)=>item.value=='').length>0){
                alert("Cek kembali data yang belum diisi!");
            }
            // ini harus jingok empty dak li nyo
            else if( $("ul#uploadedFile li").length<=0 || $("ul#uploadedAttachment li").length<=0){
                alert("File yang dibutuhkan tidak lengkap!");
            }
            else {
                $('#loading').show();
                const formData = new FormData();
                var obj = {};
                $(event.target).serializeArray().forEach(element => {
                    try{
                        obj[element.name] = JSON.parse(element.value);
                    }
                    catch(e){
                        obj[element.name] = element.value;
                    }
                });
                var Images = materialData["Images"].data.map((item)=>item.id);
                obj["Images"] = Images.filter((item)=>!removeMedia.includes(item));
                
                for (let i = 0; i < list.files.length; i++) {
                    const file = list.files[i];
                    formData.append(`files.Images`, file, file.name);
                }

                var Attachments = materialData["Attachments"].data.map((item)=>item.id);
                obj["Attachments"] = Attachments.filter((item)=>!removeMedia.includes(item));

                for (let i = 0; i < attachment.files.length; i++) {
                    const file = attachment.files[i];
                    formData.append(`files.Attachments`, file, file.name);
                }

                if($("#videoFile").prop('files').length>0){
                    obj["Video"]=[];
                    formData.append(`files.Video`, $("#videoFile").prop('files')[0], $("#videoFile").prop('files')[0].name);
                }

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

                formData.append('data', JSON.stringify(obj));
                request.open('PUT', $('#host').val()+"/api/materials/"+$("#selMaterial").val());
                request.send(formData);
            }
        }
        else{
            if($(event.target).serializeArray().filter((item)=>item.value=='').length>0){
                alert("Cek kembali data yang belum diisi!");
            }
            else if($('input#videoFile').prop('files').length<=0 || list.files.length<=0 || attachment.files.length<=0){
                alert("File yang dibutuhkan tidak lengkap!");
            }
            else{
                $('#loading').show();
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
            }
        }
        
    });

    $("#formFile").change( (event) => {
        if(event.target.files.length>0){
            for(var i=0;i<event.target.files.length;i++){
                list.items.add(event.target.files[i]);
                $("#uploadedFile").append(
                    `<li name='${event.target.files[i].name.replace(/["']/g, "")}'>${event.target.files[i].name}
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
                    `<li name='${event.target.files[i].name.replace(/["']/g, "")}'>${event.target.files[i].name}
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
