export default function isMobile (ua) {
  return /IEMobile|Windows Phone|Lumia|iPhone|iP[oa]d|Android|BlackBerry|PlayBook|BB10|Mobile Safari|webOS|Mobile|Tablet|Opera Mini|\bCrMo\/|Opera Mobi|NetFront|PSP/i.test(ua)
}
