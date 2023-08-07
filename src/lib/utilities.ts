import supportedChains from './chains';
import { IChainData } from './types';

export function getChainData(chainId?: number): IChainData {
  if (!chainId) {
    return null as any;
  }
  const chainData = supportedChains.filter(
    (chain: any) => chain.chain_id === chainId
  )[0];

  if (!chainData) {
    throw new Error('ChainId missing or not supported');
  }

  const API_KEY = '460f40a260564ac4a4f4b3fffb032dad';

  if (
    chainData.rpc_url.includes('infura.io') &&
    chainData.rpc_url.includes('%API_KEY%') &&
    API_KEY
  ) {
    const rpcUrl = chainData.rpc_url.replace('%API_KEY%', API_KEY);

    return {
      ...chainData,
      rpc_url: rpcUrl,
    };
  }

  return chainData;
}

export function ellipseAddress(address = '', width = 6): string {
  if (!address) {
    return '';
  }
  return `${address.slice(0, width)}...${address.slice(-width)}`;
}

export function numDaysBetween(d1: any, d2:any) {
  var diff = Math.abs(d1 - d2.getTime() / 1000);
  console.log('d1', d1);
  console.log('d2', d2);

  if (diff <= 0) {
    return 0;
  } else {
    return diff / (60 * 60 * 24);
  }
}

export function timeConverter(UNIX_timestamp:any) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time =
    date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
  return time;
}

export function greeter() {
  var d = new Date();
  var hour = d.getHours();
  if (hour >= 6 && hour < 12) {
    return 'Good Morning';
  } else if (hour > +12 && hour < 18) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
}

export function truncateString(str:any, length:any) {
  return str.length > length ? str.substring(0, length - 3) + '...' : str;
}
