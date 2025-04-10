import axios from 'axios'
export default function req(method, url, formdata = null, header = null) {
    const option = {
        url: url,
        method: method,
        maxBodyLength: Infinity,
        headers: header,
        data: formdata
    }
    return axios.request(option).then((response) => { return response.data }).catch((err) => { return err })
}
