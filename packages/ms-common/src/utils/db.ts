export function parseConnectionConfig(
  hostsEnv: string,
  portsEnv: string,
  entityType: "MongoDB" | "RabbitMQ",
) {
  const parseEnvVarArr = (str: string) => str.split(",").map((term) => term.trim());
  const hostsArr = parseEnvVarArr(hostsEnv);
  const portsArr = parseEnvVarArr(portsEnv); 

  if (hostsArr.length !== portsArr.length) {
    throw new Error(
      `Configuration error for ${entityType}: Mismatch in the number of hosts (${hostsArr.length}) and ports (${portsArr.length}). Ensure each host has a corresponding port.`,
    );
  }
  
  const hosts: string[] = portsArr.length === 1 ? Array(portsArr.length).fill(hostsArr[0]) : hostsArr;
  const ports: string[] = hostsArr.length === 1 ? Array(hostsArr.length).fill(portsArr[0]) : portsArr;

  return {
    hosts,
    ports,
  };
}
