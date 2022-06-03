import request from '@/util/request';

export default function getNextStep(data:any) {
  return request({
    method: 'post',
    data,
  });
}
