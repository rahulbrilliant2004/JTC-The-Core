import axios from 'axios';
const BASE_API = 'http://coreapi.skyware.systems/api/';

export const getEntityList = (entity, data, token) => {
  //console.log('Calling Base API : ',BASE_API + entity);
  return axios.get(BASE_API + entity, {params: data, cancelToken: token});
};

export const getEntity = (entity, data) => {
  return axios.get(BASE_API + entity, {params: data});
};

export const putFormDataEntity = (entity, data) => {
  var config = {
    headers: {'Content-Type': 'multipart/form-data'},
  };
  var fd = new FormData();
  Object.keys(data).map((key, value) => {
    console.log(key, data[key])

    if(data[key] instanceof Array) {
      data[key].forEach((element, index)  => {
        if (element instanceof Object) {
          for (let childKey in element) {
            fd.append(`${key}[${index}][${childKey}]`, element[childKey]);
          }
        } else {
          fd.append(`${key}[]`, element);
        }
      })

      return;
    }

    return fd.set(key, data[key]);
  });
  return axios.put(BASE_API + entity, fd, config);
}; 

export const postEntity = (entity, data) => {
  var config = {
    headers: {'Content-Type': 'multipart/form-data'},
  };
  var fd = new FormData();
  Object.keys(data).map((key, value) => {
    console.log(key, data[key])

    if(data[key] instanceof Array) {
      data[key].forEach((element, index)  => {
        if (element instanceof Object) {
          for (let childKey in element) {
            fd.append(`${key}[${index}][${childKey}]`, element[childKey]);
          }
        } else {
          fd.append(`${key}[]`, element);
        }
      })

      return;
    }

    return fd.set(key, data[key]);
  });
  return axios.post(BASE_API + entity, fd, config);
};
export const postJsonEntity = (entity, data) => {
  return axios.post(BASE_API + entity, data);
};
export const putEntity = (entity, data) => {
  var config = {
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  };

  var formBody = JSON_to_URLEncoded(data)

  return axios.put(BASE_API + entity, formBody, config);
};

function JSON_to_URLEncoded(element,key,list){
  var list = list || [];
  if(typeof(element)=='object'){
    for (var idx in element)
      JSON_to_URLEncoded(element[idx],key?key+'['+idx+']':idx,list);
  } else {
    list.push(key+'='+encodeURIComponent(element));
  }
  return list.join('&');
}
