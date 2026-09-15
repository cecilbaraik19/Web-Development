import Investigation from '../models/Investigation.js';

/**
 * Finds prior investigations that share an origin IP, a sender domain,
 * or the same ISP/hosting infrastructure with the given case data.
 * This is the core "identity correlation" logic — matching infrastructure
 * indicators is treated as evidence of a linked campaign.
 */
export async function findRelatedCases(caseData, excludeId = null) {
  const { extractedIp, extractedDomains = [], estimatedGeo } = caseData;
  const isp = estimatedGeo?.isp;

  const orConditions = [];
  if (extractedIp && extractedIp !== 'Unknown' && extractedIp !== '0.0.0.0') {
    orConditions.push({ extractedIp });
  }
  if (extractedDomains.length > 0) {
    orConditions.push({ extractedDomains: { $in: extractedDomains } });
  }
  if (isp && isp !== 'Unknown Provider' && isp !== 'Local Infrastructure') {
    orConditions.push({ 'estimatedGeo.isp': isp });
  }

  if (orConditions.length === 0) return [];

  const filter = { $or: orConditions };
  if (excludeId) filter._id = { $ne: excludeId };

  const related = await Investigation.find(filter)
    .select('-rawEmail -fullReport')
    .sort({ createdAt: -1 })
    .limit(15);

  return related.map((doc) => {
    const reasons = [];
    if (doc.extractedIp && doc.extractedIp === extractedIp) reasons.push('Same origin IP');
    if (doc.extractedDomains?.some((d) => extractedDomains.includes(d))) reasons.push('Shared sender domain');
    if (isp && doc.estimatedGeo?.isp === isp) reasons.push('Same ISP/hosting infrastructure');
    return { ...doc.toObject(), matchReasons: reasons };
  });
}

/**
 * Assigns a cluster ID to a new case. If any related case already belongs
 * to a cluster, the new case joins it — making "campaign" grouping real
 * instead of a static per-case label.
 */
export function assignClusterId(relatedCases) {
  const existingCluster = relatedCases.find((c) => c.clusterId)?.clusterId;
  if (existingCluster) return existingCluster;

  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CLUSTER-${randomSuffix}`;
}