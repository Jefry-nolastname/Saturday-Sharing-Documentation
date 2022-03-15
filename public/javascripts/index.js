$("#divisionSelect").change(async (e)=>{
    $(e.target).parent().submit();
});
var Files = [];
function removeUpload(e){
    var li = $(e.target).parent();
    li.remove();
    Files = Files.filter((i)=>i.name!=li.attr("name"));
    console.log(Files);
}
var exampleModal = document.getElementById('CreateTopicModal')
exampleModal.addEventListener('show.bs.modal', function (event) {
    Files = [];
    $("input").val("");
    $("#uploadedFile").empty();
    $("#formFile").change( (event) => {
        if(event.target.files.length>0){
            for(var i=0;i<event.target.files.length;i++){
                Files.push(event.target.files[i]);
                $("#uploadedFile").append(
                    `<li name='${event.target.files[i].name}'>${event.target.files[i].name}
                        <button type="button" class="btn-close removeUpload" onclick="removeUpload(event)" aria-label="Close"></button>
                    </li>`
                );
            }
            $(event.target).val("");
        }
    });
    $("#join-form").change(async (event)=>{
        const file = event.target.files[0];
        const data = await file.arrayBuffer();
        /* data is an ArrayBuffer */
        const workbook = XLSX.read(data);
        // workbook.Sheets[workbook.SheetNames[0]]
        var aoa = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {header: 0});
        var container = document.getElementById('participantCounter');
        container.innerHTML = `${aoa.length} Participant(s)`;        
    });
})