function updateAppt(id){
    $.ajax({
        url: '/appts/' + id,
        type: 'PUT',
        data: $('#update-appt').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
