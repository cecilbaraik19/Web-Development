import React, {
    useEffect,
    useState
} from "react";

import axios from "axios";

import {
    AlertTriangle,
    CheckCircle,
    XCircle,
    Globe,
    Shield,
    Server,
    Mail,
    Link as LinkIcon,
    Paperclip,
    Database,
    Search,
    RefreshCw
} from "lucide-react";

import ThreatGraph from "./components/ThreatGraph";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";


// ============================================================
// LEAFLET ICON FIX
// ============================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"
});


// ============================================================
// BACKEND
// ============================================================

const BACKEND_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";


// ============================================================
// HELPERS
// ============================================================

function formatValue(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "NOT AVAILABLE";
    }

    return String(value);
}


function getVerdictIcon(verdict) {

    if (verdict === "MALICIOUS") {
        return <XCircle size={22} />;
    }

    if (verdict === "SUSPICIOUS") {
        return <AlertTriangle size={22} />;
    }

    return <CheckCircle size={22} />;
}


function getRiskClass(score) {

    if (score >= 70) {
        return "text-red-500";
    }

    if (score >= 35) {
        return "text-yellow-500";
    }

    return "text-green-500";
}


function getAuthClass(value) {

    if (
        value === "PASS" ||
        value === "VERIFIED" ||
        value === "ALIGNED"
    ) {
        return "text-green-500";
    }

    if (value === "FAIL") {
        return "text-red-500";
    }

    return "text-gray-400";
}


// ============================================================
// COMPONENT
// ============================================================

export default function App() {

    const [
        emailText,
        setEmailText
    ] = useState("");

    const [
        report,
        setReport
    ] = useState(null);

    const [
        caseId,
        setCaseId
    ] = useState(null);

    const [
        history,
        setHistory
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(false);

    const [
        error,
        setError
    ] = useState("");


    // ========================================================
    // HISTORY
    // ========================================================

    async function fetchHistory() {

        try {

            const response =
                await axios.get(
                    `${BACKEND_URL}/api/history`,
                    {
                        timeout: 30000
                    }
                );

            setHistory(
                response.data.investigations ||
                []
            );

        } catch (err) {

            console.error(
                "History error:",
                err
            );
        }
    }


    useEffect(() => {

        fetchHistory();

    }, []);


    // ========================================================
    // ANALYZE
    // ========================================================

    async function handleAnalyze() {

        if (!emailText.trim()) {

            setError(
                "Please paste an email before analysis."
            );

            return;
        }


        setLoading(true);
        setError("");
        setReport(null);
        setCaseId(null);


        try {

            const response =
                await axios.post(

                    `${BACKEND_URL}/api/investigate`,

                    {
                        emailContent:
                            emailText
                    },

                    {
                        timeout: 70000,

                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );


            if (
                response.data.status !==
                "success"
            ) {

                throw new Error(
                    response.data.message ||
                    "Analysis failed."
                );
            }


            setReport(
                response.data.report
            );

            setCaseId(
                response.data.caseId
            );


            await fetchHistory();

        } catch (err) {

            console.error(
                "Analysis error:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to analyze email."
            );

        } finally {

            setLoading(false);
        }
    }


    // ========================================================
    // RESET
    // ========================================================

    function resetAnalysis() {

        setReport(null);
        setCaseId(null);
        setError("");
    }


    // ========================================================
    // EMPTY STATE
    // ========================================================

    if (!report) {

        return (
            <div className="min-h-screen bg-slate-950 text-white">

                <div className="max-w-6xl mx-auto px-6 py-10">

                    <div className="mb-10">

                        <div className="flex items-center gap-3 mb-3">

                            <Shield
                                className="text-cyan-400"
                                size={32}
                            />

                            <h1 className="text-3xl font-bold">
                                CertiMail Forensics
                            </h1>

                        </div>

                        <p className="text-slate-400">
                            Evidence-based email threat
                            detection and forensic intelligence.
                        </p>

                    </div>


                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

                        <div className="flex items-center gap-3 mb-4">

                            <Mail
                                size={20}
                                className="text-cyan-400"
                            />

                            <h2 className="text-xl font-semibold">
                                Email Evidence
                            </h2>

                        </div>


                        <textarea
                            value={emailText}
                            onChange={(event) =>
                                setEmailText(
                                    event.target.value
                                )
                            }
                            placeholder="Paste the complete raw email including headers here..."
                            className="w-full h-96 bg-slate-950 border border-slate-700 rounded-xl p-4 text-sm font-mono outline-none focus:border-cyan-500"
                        />


                        {error && (

                            <div className="mt-4 bg-red-950/40 border border-red-800 rounded-lg p-4 text-red-300">

                                {error}

                            </div>
                        )}


                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="mt-5 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 flex items-center gap-2 font-semibold"
                        >

                            {loading ? (
                                <>
                                    <RefreshCw
                                        size={18}
                                        className="animate-spin"
                                    />

                                    Analyzing live evidence...
                                </>
                            ) : (
                                <>
                                    <Search size={18} />

                                    Analyze Email
                                </>
                            )}

                        </button>

                    </div>


                    {history.length > 0 && (

                        <div className="mt-8">

                            <h2 className="text-xl font-semibold mb-4">
                                Recent Investigations
                            </h2>


                            <div className="space-y-3">

                                {history.map(
                                    (item) => (

                                        <div
                                            key={item.caseId}
                                            className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between"
                                        >

                                            <div>

                                                <div className="font-mono text-sm">
                                                    {item.caseId}
                                                </div>

                                                <div className="text-slate-400 text-sm mt-1">
                                                    {item.verdict}
                                                </div>

                                            </div>


                                            <div
                                                className={
                                                    getRiskClass(
                                                        item.riskScore
                                                    )
                                                }
                                            >
                                                {item.riskScore}/100
                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    )}

                </div>

            </div>
        );
    }


    // ========================================================
    // REPORT DATA
    // ========================================================

    const authentication =
        report.authentication || {};

    const identity =
        report.identity_analysis || {};

    const receivedChain =
        report.received_chain || [];

    const ips =
        report.ip_intelligence || [];

    const urls =
        report.urls || [];

    const attachments =
        report.attachments || [];

    const evidence =
        report.evidence || [];

    const graph =
        report.graph || {
            nodes: [],
            relationships: []
        };

    const campaign =
        report.campaign || {};

    const geo =
        report.estimated_geo;


    // ========================================================
    // RESULT
    // ========================================================

    return (

        <div className="min-h-screen bg-slate-950 text-white">

            <div className="max-w-7xl mx-auto px-6 py-8">


                {/* HEADER */}

                <div className="flex justify-between items-center mb-8">

                    <div>

                        <div className="flex items-center gap-3">

                            <Shield
                                className="text-cyan-400"
                                size={30}
                            />

                            <h1 className="text-3xl font-bold">
                                Forensic Investigation
                            </h1>

                        </div>


                        {caseId && (

                            <div className="text-slate-400 text-sm font-mono mt-2">
                                Case ID: {caseId}
                            </div>

                        )}

                    </div>


                    <button
                        onClick={resetAnalysis}
                        className="px-4 py-2 border border-slate-700 rounded-lg hover:bg-slate-900"
                    >
                        New Investigation
                    </button>

                </div>


                {/* VERDICT */}

                <div className="grid md:grid-cols-3 gap-5 mb-6">

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

                        <div className="text-slate-400 text-sm">
                            Verdict
                        </div>

                        <div className="flex items-center gap-3 mt-3">

                            {getVerdictIcon(
                                report.verdict
                            )}

                            <span className="text-2xl font-bold">
                                {formatValue(
                                    report.verdict
                                )}
                            </span>

                        </div>

                    </div>


                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

                        <div className="text-slate-400 text-sm">
                            Risk Score
                        </div>

                        <div
                            className={`text-3xl font-bold mt-3 ${getRiskClass(
                                report.risk_score
                            )}`}
                        >
                            {formatValue(
                                report.risk_score
                            )}
                            /100
                        </div>

                    </div>


                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

                        <div className="text-slate-400 text-sm">
                            Evidence Confidence
                        </div>

                        <div className="text-3xl font-bold mt-3">
                            {formatValue(
                                report.confidence
                            )}%
                        </div>

                    </div>

                </div>


                {/* AUTHENTICATION */}

                <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">

                    <div className="flex items-center gap-3 mb-5">

                        <Shield
                            size={20}
                            className="text-cyan-400"
                        />

                        <h2 className="text-xl font-semibold">
                            Email Authentication
                        </h2>

                    </div>


                    <div className="grid md:grid-cols-3 gap-4">

                        {[
                            ["SPF", authentication.spf],
                            ["DKIM", authentication.dkim],
                            ["DMARC", authentication.dmarc]
                        ].map(
                            ([name, value]) => (

                                <div
                                    key={name}
                                    className="bg-slate-950 rounded-lg p-4"
                                >

                                    <div className="text-slate-400 text-sm">
                                        {name}
                                    </div>

                                    <div
                                        className={`text-xl font-bold mt-2 ${getAuthClass(
                                            value
                                        )}`}
                                    >
                                        {formatValue(
                                            value
                                        )}
                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </section>


                {/* IDENTITY */}

                <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">

                    <div className="flex items-center gap-3 mb-5">

                        <Mail
                            size={20}
                            className="text-cyan-400"
                        />

                        <h2 className="text-xl font-semibold">
                            Sender Identity
                        </h2>

                    </div>


                    <div className="grid md:grid-cols-2 gap-4">

                        <div>
                            <div className="text-slate-500 text-sm">
                                From
                            </div>

                            <div className="font-mono mt-1 break-all">
                                {formatValue(
                                    identity.from
                                )}
                            </div>
                        </div>


                        <div>
                            <div className="text-slate-500 text-sm">
                                Return-Path
                            </div>

                            <div className="font-mono mt-1 break-all">
                                {formatValue(
                                    identity.return_path
                                )}
                            </div>
                        </div>


                        <div>
                            <div className="text-slate-500 text-sm">
                                Reply-To
                            </div>

                            <div className="font-mono mt-1 break-all">
                                {formatValue(
                                    identity.reply_to
                                )}
                            </div>
                        </div>


                        <div>
                            <div className="text-slate-500 text-sm">
                                Sender Domain
                            </div>

                            <div className="font-mono mt-1">
                                {formatValue(
                                    report.sender_domain
                                )}
                            </div>
                        </div>

                    </div>


                    {identity.indicators?.length > 0 && (

                        <div className="mt-5 space-y-2">

                            {identity.indicators.map(
                                (indicator, index) => (

                                    <div
                                        key={index}
                                        className="text-yellow-400 text-sm"
                                    >
                                        ⚠ {indicator}
                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>


                {/* RECEIVED CHAIN */}

                <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">

                    <div className="flex items-center gap-3 mb-5">

                        <Server
                            size={20}
                            className="text-cyan-400"
                        />

                        <h2 className="text-xl font-semibold">
                            Received Relay Chain
                        </h2>

                    </div>


                    {receivedChain.length === 0 ? (

                        <div className="text-slate-500">
                            No Received headers were found.
                        </div>

                    ) : (

                        <div className="space-y-4">

                            {receivedChain.map(
                                (hop) => (

                                    <div
                                        key={hop.order}
                                        className="bg-slate-950 rounded-lg p-4"
                                    >

                                        <div className="font-semibold mb-2">
                                            Hop {hop.order}
                                        </div>


                                        <div className="text-sm text-slate-400 break-all">
                                            {hop.raw}
                                        </div>


                                        {hop.public_ips?.length > 0 && (

                                            <div className="mt-3 flex flex-wrap gap-2">

                                                {hop.public_ips.map(
                                                    ip => (

                                                        <span
                                                            key={ip}
                                                            className="font-mono text-cyan-400 bg-cyan-950/40 px-2 py-1 rounded"
                                                        >
                                                            {ip}
                                                        </span>

                                                    )
                                                )}

                                            </div>

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>


                {/* IP INTELLIGENCE */}

                <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">

                    <div className="flex items-center gap-3 mb-5">

                        <Globe
                            size={20}
                            className="text-cyan-400"
                        />

                        <h2 className="text-xl font-semibold">
                            IP Intelligence
                        </h2>

                    </div>


                    {ips.length === 0 ? (

                        <div className="text-slate-500">
                            No public IP addresses were observed.
                        </div>

                    ) : (

                        <div className="space-y-4">

                            {ips.map(
                                (ip) => (

                                    <div
                                        key={ip.ip}
                                        className="bg-slate-950 rounded-lg p-5"
                                    >

                                        <div className="font-mono text-cyan-400 text-lg">
                                            {ip.ip}
                                        </div>


                                        {ip.status === "AVAILABLE" ? (

                                            <div className="grid md:grid-cols-3 gap-4 mt-4 text-sm">

                                                <div>
                                                    Country:
                                                    <strong className="ml-2">
                                                        {formatValue(
                                                            ip.country
                                                        )}
                                                    </strong>
                                                </div>

                                                <div>
                                                    City:
                                                    <strong className="ml-2">
                                                        {formatValue(
                                                            ip.city
                                                        )}
                                                    </strong>
                                                </div>

                                                <div>
                                                    ISP:
                                                    <strong className="ml-2">
                                                        {formatValue(
                                                            ip.isp
                                                        )}
                                                    </strong>
                                                </div>

                                                <div>
                                                    ASN:
                                                    <strong className="ml-2">
                                                        {formatValue(
                                                            ip.asn
                                                        )}
                                                    </strong>
                                                </div>

                                                <div>
                                                    Organization:
                                                    <strong className="ml-2">
                                                        {formatValue(
                                                            ip.organization
                                                        )}
                                                    </strong>
                                                </div>

                                                <div>
                                                    Hosting:
                                                    <strong className="ml-2">
                                                        {formatValue(
                                                            ip.is_hosting
                                                        )}
                                                    </strong>
                                                </div>

                                            </div>

                                        ) : (

                                            <div className="text-slate-500 mt-3">
                                                Live IP intelligence unavailable.
                                            </div>

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>


                {/* MAP */}

                {geo && geo.latitude && geo.longitude && (

                    <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">

                        <h2 className="text-xl font-semibold mb-4">
                            Probable Earliest Observed Infrastructure
                        </h2>

                        <p className="text-slate-400 text-sm mb-4">
                            This represents the earliest public IP observed
                            in the supplied Received chain. It does not prove
                            the physical location or identity of the sender.
                        </p>


                        <div className="h-[400px] rounded-xl overflow-hidden">

                            <MapContainer
                                center={[
                                    geo.latitude,
                                    geo.longitude
                                ]}
                                zoom={5}
                                style={{
                                    height: "100%",
                                    width: "100%"
                                }}
                            >

                                <TileLayer
                                    attribution="© OpenStreetMap contributors"
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />


                                <Marker
                                    position={[
                                        geo.latitude,
                                        geo.longitude
                                    ]}
                                >

                                    <Popup>

                                        <strong>
                                            {formatValue(
                                                geo.city
                                            )}
                                        </strong>

                                        <br />

                                        {formatValue(
                                            geo.country
                                        )}

                                        <br />

                                        IP:
                                        {" "}
                                        {formatValue(
                                            geo.ip
                                        )}

                                    </Popup>

                                </Marker>

                            </MapContainer>

                        </div>

                    </section>

                )}


                {/* URLS */}

                <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">

                    <div className="flex items-center gap-3 mb-5">

                        <LinkIcon
                            size={20}
                            className="text-cyan-400"
                        />

                        <h2 className="text-xl font-semibold">
                            Extracted URLs
                        </h2>

                    </div>


                    {urls.length === 0 ? (

                        <div className="text-slate-500">
                            No URLs were found.
                        </div>

                    ) : (

                        <div className="space-y-3">

                            {urls.map(
                                (url, index) => (

                                    <div
                                        key={index}
                                        className="bg-slate-950 rounded-lg p-4"
                                    >

                                        <div className="font-mono text-sm break-all text-cyan-400">
                                            {url.url}
                                        </div>


                                        <div className="text-sm text-slate-400 mt-2">
                                            Host:
                                            {" "}
                                            {url.hostname}
                                        </div>


                                        {url.indicators?.length > 0 && (

                                            <div className="mt-2 text-yellow-400 text-sm">

                                                {url.indicators.join(
                                                    " • "
                                                )}

                                            </div>

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>


                {/* ATTACHMENTS */}

                <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">

                    <div className="flex items-center gap-3 mb-5">

                        <Paperclip
                            size={20}
                            className="text-cyan-400"
                        />

                        <h2 className="text-xl font-semibold">
                            Attachments
                        </h2>

                    </div>


                    {attachments.length === 0 ? (

                        <div className="text-slate-500">
                            No attachments were found.
                        </div>

                    ) : (

                        <div className="space-y-3">

                            {attachments.map(
                                (attachment, index) => (

                                    <div
                                        key={index}
                                        className="bg-slate-950 rounded-lg p-4"
                                    >

                                        <div className="font-mono">
                                            {formatValue(
                                                attachment.filename
                                            )}
                                        </div>

                                        <div className="text-sm text-slate-400 mt-1">
                                            {formatValue(
                                                attachment.content_type
                                            )}
                                        </div>


                                        {attachment.suspicious && (

                                            <div className="text-red-400 text-sm mt-2">
                                                Potentially executable
                                                attachment type detected.
                                            </div>

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>


                {/* DNS / WHOIS */}

                <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">

                    <div className="flex items-center gap-3 mb-5">

                        <Database
                            size={20}
                            className="text-cyan-400"
                        />

                        <h2 className="text-xl font-semibold">
                            DNS & WHOIS Intelligence
                        </h2>

                    </div>


                    <pre className="bg-slate-950 rounded-xl p-5 overflow-auto text-sm text-slate-300">
                        {JSON.stringify(
                            report.whois_data,
                            null,
                            2
                        )}
                    </pre>

                </section>


                {/* EVIDENCE */}

                <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">

                    <div className="flex items-center gap-3 mb-5">

                        <AlertTriangle
                            size={20}
                            className="text-cyan-400"
                        />

                        <h2 className="text-xl font-semibold">
                            Evidence
                        </h2>

                    </div>


                    {evidence.length === 0 ? (

                        <div className="text-green-400">
                            No risk indicators were identified by
                            the current evidence engine.
                        </div>

                    ) : (

                        <div className="space-y-3">

                            {evidence.map(
                                (item, index) => (

                                    <div
                                        key={index}
                                        className="bg-slate-950 rounded-lg p-4"
                                    >

                                        <div className="font-semibold">
                                            {item.message}
                                        </div>


                                        <div className="text-sm text-slate-500 mt-1">
                                            Type:
                                            {" "}
                                            {item.type}
                                            {" • "}
                                            Severity:
                                            {" "}
                                            {item.severity}
                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>


                {/* CAMPAIGN */}

                <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">

                    <h2 className="text-xl font-semibold mb-4">
                        Campaign Correlation
                    </h2>


                    {campaign.status ===
                    "FINGERPRINT_GENERATED" ? (

                        <>

                            <div className="text-green-400 font-semibold">
                                Evidence fingerprint generated
                            </div>

                            <div className="font-mono text-xs text-slate-400 mt-3 break-all">
                                {campaign.fingerprint}
                            </div>

                            <div className="text-slate-500 text-sm mt-3">
                                This is a deterministic fingerprint of
                                observed indicators. It is not a claim that
                                this email belongs to a known threat campaign.
                            </div>

                        </>

                    ) : (

                        <div className="text-slate-500">
                            Insufficient evidence for campaign
                            clustering. Status: UNCLUSTERED.
                        </div>

                    )}

                </section>


                {/* GRAPH */}

                <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">

                    <h2 className="text-xl font-semibold mb-4">
                        Threat Relationship Graph
                    </h2>


                    {graph.nodes?.length > 0 ? (

                        <ThreatGraph
                            graphData={{
                                nodes:
                                    graph.nodes,

                                links:
                                    graph.relationships?.map(
                                        relationship => ({
                                            source:
                                                relationship.source,

                                            target:
                                                relationship.target,

                                            relation:
                                                relationship.relation
                                        })
                                    ) || []
                            }}
                        />

                    ) : (

                        <div className="text-slate-500">
                            No graph relationships were identified.
                        </div>

                    )}

                </section>


                {/* FORENSIC SUMMARY */}

                <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">

                    <h2 className="text-xl font-semibold mb-4">
                        Forensic Interpretation
                    </h2>


                    <div className="space-y-3 text-sm text-slate-400">

                        <p>
                            Probable earliest observed public IP:
                            {" "}
                            <span className="font-mono text-cyan-400">
                                {formatValue(
                                    report.forensic_summary
                                        ?.probable_origin_ip
                                )}
                            </span>
                        </p>


                        <p>
                            {formatValue(
                                report.forensic_summary
                                    ?.origin_interpretation
                            )}
                        </p>


                        <p>
                            External intelligence:
                            {" "}
                            {(
                                report.forensic_summary
                                    ?.external_intelligence_sources ||
                                []
                            ).join(", ") ||
                                "NONE"}
                        </p>

                    </div>

                </section>

            </div>

        </div>

    );
}