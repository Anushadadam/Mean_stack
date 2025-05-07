document.addEventListener('DOMContentLoaded', function() {
  // Handle form submissions for PUT and DELETE requests
  const updateForm = document.getElementById('update-form');
  if (updateForm) {
    updateForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(updateForm);
      const personId = updateForm.getAttribute('action').split('/').pop();
      
      fetch(`/person/${personId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData.entries()))
      })
      .then(response => {
        if (response.ok) {
          window.location.href = '/person';
        } else {
          return response.json().then(data => {
            throw new Error(data.error || 'Update failed');
          });
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert(error.message);
      });
    });
  }

  const deleteForm = document.getElementById('delete-form');
  if (deleteForm) {
    deleteForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const personId = deleteForm.getAttribute('action').split('/').pop();
      
      fetch(`/person/${personId}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          window.location.href = '/person';
        } else {
          return response.json().then(data => {
            throw new Error(data.error || 'Delete failed');
          });
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert(error.message);
      });
    });
  }
});
