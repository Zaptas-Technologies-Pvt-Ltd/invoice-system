import React from "react";

export const GSTValidation = async (gstno) =>{
    const regex = "^[0-9]{2}[A-Z]{5}[0-9]{4}"
              + "[A-Z]{1}[1-9A-Z]{1}"
              + "Z[0-9A-Z]{1}$";
          if(!gstno.match(regex)){
            return false
          }else{
            return true
          }
  }

export const accountValidation = async (accountValidation) =>{
    const regex = "/^\d{10}$/"
        if(!accountValidation.match(regex)){
        return false
        }else{
        return true
        }
}