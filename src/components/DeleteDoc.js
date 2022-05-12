import React from 'react';
import { useMoralisQuery } from 'react-moralis';

function DeleteDoc({docDeleteId}) {
    const { fetch } = useMoralisQuery("doctors",(query) => query.equalTo("objectId", docDeleteId),[docDeleteId],{ autoFetch: false });
    const deleteDoctor = async (id) => {
       
        fetch ({
            onSuccess: (doc) => {
                console.log(doc);
                    doc.destroy().then(
                        (doc) => {
                            alert("Doctor deleted successfully");
                        },
                        (errors) => {
                            alert("The delete failed");
                        }
                    )                      
            },
            onError: (error) => {
                alert("The object was not retrieved successfully");
            },
          });
    }

  return (
    <div>
     {

     }
    </div>
  )
}

export default DeleteDoc