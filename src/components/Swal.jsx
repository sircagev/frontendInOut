import React, { useEffect } from 'react';
import swal from 'sweetalert';

const SwalAlert = ({title, text, icon}) => {
  useEffect(() => {
    swal({
      title: {title},
      text: {text},
      icon: {icon},
      buttons: false,
      timer: 2000, 
    });
  }, []);

  return (
    <div>
      
    </div>
  );
}

export default SwalAlert;
