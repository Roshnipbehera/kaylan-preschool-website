// Virus-scan abstraction. Every uploaded attachment buffer passes through
// scanFile() before being sent to Cloudinary. This stub always reports
// "clean" -- swap the body for a real ClamAV daemon call (clamscan/clamd
// socket) or a VirusTotal API lookup when those credentials/infra are
// available. Callers never need to change: the interface is stable.
export interface ScanResult {
  clean: boolean;
  reason?: string;
}

export async function scanFile(_buffer: Buffer): Promise<ScanResult> {
  // TODO(future pass): integrate ClamAV (clamscan) or VirusTotal here.
  return { clean: true };
}
