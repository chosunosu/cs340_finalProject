function deleteAppt(id){
    $.ajax({
        url: '/appts/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};



function deleteAssistAppt(apid, aid){
  $.ajax({
      url: '/people_certs/apid/' + apid + '/cert/' + aid,
      type: 'DELETE',
      success: function(result){
          if(result.responseText != undefined){
            alert(result.responseText)
          }
          else {
            window.location.reload(true)
          } 
      }
  })
};
