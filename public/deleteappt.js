function deleteAppt(id){
    $.ajax({
        url: '/appts/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};


function deleteAssistAppt(pid, cid){
  $.ajax({
      url: '/people_certs/pid/' + pid + '/cert/' + cid,
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
