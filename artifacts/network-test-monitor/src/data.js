// Assignment: realistic starter test data; the dashboard metrics derive from this editable list.
export const initialTests = [
  { id: 'NT-2048', name: 'Gateway health check', networkType: 'Wi-Fi', latency: 24, packetLoss: 0, status: 'Passed' },
  { id: 'NT-2047', name: 'Mobile checkout API', networkType: '5G', latency: 86, packetLoss: 0.2, status: 'Passed' },
  { id: 'NT-2046', name: 'Warehouse uplink', networkType: '4G', latency: 312, packetLoss: 4.8, status: 'Failed' },
  { id: 'NT-2045', name: 'DNS resolution — east', networkType: 'Wi-Fi', latency: 41, packetLoss: 0, status: 'Passed' },
  { id: 'NT-2044', name: 'Edge node sync', networkType: '5G', latency: 128, packetLoss: 0.7, status: 'Running' },
  { id: 'NT-2043', name: 'Branch office tunnel', networkType: '4G', latency: 179, packetLoss: 1.3, status: 'Failed' },
];

export const networkTypes = ['4G', '5G', 'Wi-Fi'];
export const testStatuses = ['Passed', 'Failed', 'Running'];
