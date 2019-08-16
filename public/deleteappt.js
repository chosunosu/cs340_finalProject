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
      url: '/appt_assist/apid/' + apid + '/aid/' + aid,
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
