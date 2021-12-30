import dayjs from 'dayjs';

export const isExpired = (expiredDate) => dayjs().isAfter(dayjs(expiredDate));
