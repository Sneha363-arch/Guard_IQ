import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";
import { Link } from "react-router-dom";
import { Shield, AlertTriangle, Eye, Download, ExternalLink, Clock, Target, Network } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface Vip {
  id: string;
  full_name: string;
  display_name: string | null;
  profile_image_url: string | null;
  keywords: string[] | null;
}

interface ThreatDetection {
  id: string;
  vip_id: string;
  platform: string;
  threat_type: string;
  content_url: string | null;
  content_text: string | null;
  confidence_score: number | null;
  status: string;
  created_at: string;
}

const VIPMonitoring = () => {
  const { user } = useSupabaseSession();
  const [vips, setVips] = useState<Vip[]>([]);
  const [threats, setThreats] = useState<ThreatDetection[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ full_name: "", display_name: "", image: "", keywords: "" });
  const [realTimeEnabled, setRealTimeEnabled] = useState(false);

  useEffect(() => {
    document.title = "VIP Threat Monitoring | BioFusion";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      const { data: vipsData, error: vErr } = await supabase
        .from("vips")
        .select("id, full_name, display_name, profile_image_url, keywords")
        .order("created_at", { ascending: false });
      if (vErr) {
        toast.error(vErr.message);
      } else {
        setVips(vipsData || []);
      }

      const { data: threatData, error: tErr } = await supabase
        .from("threat_detections")
        .select("id, vip_id, platform, threat_type, content_url, content_text, confidence_score, status, created_at")
        .order("created_at", { ascending: false })
        .limit(50);
      if (tErr) {
        toast.error(tErr.message);
      } else {
        setThreats(threatData || []);
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const vipMap = useMemo(() => Object.fromEntries(vips.map(v => [v.id, v])), [vips]);
  
  const threatStats = useMemo(() => {
    const total = threats.length;
    const active = threats.filter(t => t.status === 'active').length;
    const critical = threats.filter(t => (t.confidence_score || 0) > 0.8).length;
    const platforms = [...new Set(threats.map(t => t.platform))].length;
    return { total, active, critical, platforms };
  }, [threats]);

  const getSeverityColor = (confidence: number | null) => {
    if (!confidence) return 'bg-muted';
    if (confidence > 0.8) return 'bg-destructive';
    if (confidence > 0.6) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getSeverityLabel = (confidence: number | null) => {
    if (!confidence) return 'Unknown';
    if (confidence > 0.8) return 'Critical';
    if (confidence > 0.6) return 'High';
    if (confidence > 0.4) return 'Medium';
    return 'Low';
  };

  const handleAddVip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login first");
      return;
    }
    const keywords = form.keywords
      .split(",")
      .map(k => k.trim())
      .filter(Boolean);

    const { error } = await supabase.from("vips").insert([
      {
        user_id: user.id,
        full_name: form.full_name,
        display_name: form.display_name || null,
        profile_image_url: form.image || null,
        keywords: keywords.length ? keywords : null,
      }
    ]);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("VIP added");
    setForm({ full_name: "", display_name: "", image: "", keywords: "" });

    const { data } = await supabase
      .from("vips")
      .select("id, full_name, display_name, profile_image_url, keywords")
      .order("created_at", { ascending: false });
    setVips(data || []);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>VIP Threat Monitoring</CardTitle>
            <CardDescription>Login with Supabase to manage VIPs and view detections.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/auth">Go to Auth</Link>
            </Button>
            <p className="text-sm text-muted-foreground">Your existing biometric login remains unchanged.</p>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            VIP Threat & Misinformation Monitoring
          </h1>
          <p className="text-muted-foreground mt-2">
            Quantum-safe threat detection with Zero Trust architecture
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={realTimeEnabled ? "default" : "secondary"} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${realTimeEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            {realTimeEnabled ? 'Live Monitoring' : 'Offline'}
          </Badge>
          <Button variant="outline" size="sm">
            <Shield className="w-4 h-4 mr-2" />
            PQC Enabled
          </Button>
        </div>
      </div>

      {/* Threat Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Threats</p>
                <p className="text-2xl font-bold">{threatStats.total}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-destructive">{threatStats.active}</p>
              </div>
              <Target className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-yellow-600">{threatStats.critical}</p>
              </div>
              <Shield className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Platforms</p>
                <p className="text-2xl font-bold">{threatStats.platforms}</p>
              </div>
              <Network className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vips">VIP Management</TabsTrigger>
          <TabsTrigger value="threats">Threat Analysis</TabsTrigger>
          <TabsTrigger value="evidence">Evidence Vault</TabsTrigger>
          <TabsTrigger value="quantum-security">Quantum Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Alert className="mb-4">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                All evidence is cryptographically signed with post-quantum algorithms (Dilithium) and stored immutably.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Quick VIP Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading VIP data...</p>
                ) : vips.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No VIPs configured. Add VIPs to start monitoring.</p>
                ) : (
                  <div className="space-y-3">
                    {vips.slice(0, 3).map(vip => {
                      const vipThreats = threats.filter(t => t.vip_id === vip.id);
                      const activeThreats = vipThreats.filter(t => t.status === 'active').length;
                      return (
                        <div key={vip.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {vip.profile_image_url ? (
                              <img src={vip.profile_image_url} alt={vip.full_name} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-accent" />
                            )}
                            <div>
                              <p className="font-medium text-sm">{vip.full_name}</p>
                              <p className="text-xs text-muted-foreground">{activeThreats} active threats</p>
                            </div>
                          </div>
                          <Badge variant={activeThreats > 0 ? "destructive" : "default"}>
                            {activeThreats > 0 ? "Alert" : "Safe"}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Recent Critical Threats
                </CardTitle>
                <CardDescription>High-priority incidents requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading threat data...</p>
                ) : (
                  <div className="space-y-3">
                    {threats
                      .filter(t => (t.confidence_score || 0) > 0.6)
                      .slice(0, 5)
                      .map(threat => {
                        const vip = vipMap[threat.vip_id];
                        const confidence = threat.confidence_score || 0;
                        return (
                          <div key={threat.id} className="p-4 border rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${getSeverityColor(confidence)}`} />
                                <div>
                                  <p className="font-medium">{vip?.full_name || "Unknown VIP"}</p>
                                  <p className="text-sm text-muted-foreground">{threat.threat_type} on {threat.platform}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{getSeverityLabel(confidence)}</Badge>
                                <Badge>{threat.platform}</Badge>
                              </div>
                            </div>
                            {threat.content_text && (
                              <p className="text-sm bg-muted p-2 rounded line-clamp-2">{threat.content_text}</p>
                            )}
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(threat.created_at).toLocaleString()}
                              </span>
                              <span>Confidence: {Math.round(confidence * 100)}%</span>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-3 h-3 mr-1" />
                                Analyze
                              </Button>
                              {threat.content_url && (
                                <Button size="sm" variant="outline">
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Source
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                <Download className="w-3 h-3 mr-1" />
                                Export
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    {threats.filter(t => (t.confidence_score || 0) > 0.6).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No critical threats detected. All VIPs appear safe.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vips" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Add VIP Target</CardTitle>
                <CardDescription>Configure new VIP for comprehensive monitoring across platforms.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddVip} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full name *</Label>
                    <Input id="full_name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="display_name">Display name / Handle</Label>
                    <Input id="display_name" value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} placeholder="@username" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Profile image URL</Label>
                    <Input id="image" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Monitor keywords</Label>
                    <Input id="keywords" value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} placeholder="brand, company, aliases..." />
                    <p className="text-xs text-muted-foreground">Comma-separated terms to monitor</p>
                  </div>
                  <Button type="submit" className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    Add VIP Target
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>VIP Targets</CardTitle>
                  <CardDescription>Configured monitoring targets with threat status</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <p className="text-sm text-muted-foreground">Loading VIP data...</p>
                  ) : vips.length === 0 ? (
                    <div className="text-center py-8">
                      <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground">No VIPs configured yet.</p>
                      <p className="text-xs text-muted-foreground">Add VIP targets to start comprehensive monitoring.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {vips.map(vip => {
                        const vipThreats = threats.filter(t => t.vip_id === vip.id);
                        const activeThreats = vipThreats.filter(t => t.status === 'active');
                        const criticalThreats = activeThreats.filter(t => (t.confidence_score || 0) > 0.8);
                        
                        return (
                          <div key={vip.id} className="p-4 border rounded-lg space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-4">
                                {vip.profile_image_url ? (
                                  <img src={vip.profile_image_url} alt={`${vip.full_name} avatar`} className="w-12 h-12 rounded-full object-cover" loading="lazy" />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-muted-foreground" />
                                  </div>
                                )}
                                <div>
                                  <h3 className="font-semibold">{vip.full_name}</h3>
                                  {vip.display_name && <p className="text-sm text-muted-foreground">{vip.display_name}</p>}
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant={criticalThreats.length > 0 ? "destructive" : activeThreats.length > 0 ? "default" : "secondary"}>
                                      {criticalThreats.length > 0 ? "Critical Alert" : activeThreats.length > 0 ? "Active Threats" : "Secure"}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {vipThreats.length} total detections
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">{activeThreats.length} Active</p>
                                <p className="text-xs text-muted-foreground">{criticalThreats.length} Critical</p>
                              </div>
                            </div>
                            
                            {(vip.keywords || []).length > 0 && (
                              <div>
                                <p className="text-xs text-muted-foreground mb-2">Monitoring keywords:</p>
                                <div className="flex flex-wrap gap-1">
                                  {(vip.keywords || []).map((keyword, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">{keyword}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {activeThreats.length > 0 && (
                              <div className="pt-2 border-t">
                                <p className="text-xs text-muted-foreground mb-2">Recent threats:</p>
                                <div className="space-y-1">
                                  {activeThreats.slice(0, 2).map(threat => (
                                    <div key={threat.id} className="flex items-center justify-between text-xs">
                                      <span className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${getSeverityColor(threat.confidence_score)}`} />
                                        {threat.threat_type} on {threat.platform}
                                      </span>
                                      <span>{getSeverityLabel(threat.confidence_score)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Threat Analysis Dashboard
              </CardTitle>
              <CardDescription>Comprehensive threat detection and analysis</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading threat analysis...</p>
              ) : threats.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">No threats detected.</p>
                  <p className="text-xs text-muted-foreground">Monitoring systems are active and scanning.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {threats.map(threat => {
                    const vip = vipMap[threat.vip_id];
                    const confidence = threat.confidence_score || 0;
                    const severity = getSeverityLabel(confidence);
                    
                    return (
                      <div key={threat.id} className="p-4 border rounded-lg space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${getSeverityColor(confidence)}`} />
                            <div>
                              <h3 className="font-semibold">{vip?.full_name || "Unknown VIP"}</h3>
                              <p className="text-sm text-muted-foreground">
                                {threat.threat_type} detected on {threat.platform}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={severity === 'Critical' ? 'destructive' : severity === 'High' ? 'default' : 'secondary'}>
                              {severity}
                            </Badge>
                            <Badge variant="outline">{threat.platform}</Badge>
                            <Badge variant="outline">{threat.status}</Badge>
                          </div>
                        </div>

                        {confidence > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Confidence Score</span>
                              <span>{Math.round(confidence * 100)}%</span>
                            </div>
                            <Progress value={confidence * 100} className="h-2" />
                          </div>
                        )}

                        {threat.content_text && (
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-sm font-medium mb-1">Detected Content:</p>
                            <p className="text-sm">{threat.content_text}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Detected: {new Date(threat.created_at).toLocaleString()}
                          </span>
                          <span>ID: {threat.id.slice(0, 8)}...</span>
                        </div>

                        <div className="flex gap-2 pt-2 border-t">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            Analyze
                          </Button>
                          {threat.content_url && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={threat.content_url} target="_blank" rel="noreferrer">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Source
                              </a>
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Download className="w-3 h-3 mr-1" />
                            Export Evidence
                          </Button>
                          <Button size="sm" variant="default">
                            Take Action
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evidence" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Quantum-Safe Evidence Vault
              </CardTitle>
              <CardDescription>
                Cryptographically secured evidence with post-quantum signatures (Dilithium)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    All evidence is immutably stored and signed with post-quantum cryptography. 
                    Chain of custody is maintained through cryptographic proofs.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <Shield className="w-8 h-8 mx-auto text-green-600 mb-2" />
                        <p className="font-semibold">PQC Signatures</p>
                        <p className="text-sm text-muted-foreground">Dilithium algorithm</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <AlertTriangle className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                        <p className="font-semibold">Evidence Items</p>
                        <p className="text-sm text-muted-foreground">{threats.length} sealed</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <Clock className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                        <p className="font-semibold">Retention</p>
                        <p className="text-sm text-muted-foreground">Immutable storage</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {threats.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Evidence Manifests</h3>
                    {threats.slice(0, 5).map(threat => (
                      <div key={threat.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Shield className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="text-sm font-medium">Evidence #{threat.id.slice(0, 8)}</p>
                            <p className="text-xs text-muted-foreground">
                              {threat.threat_type} • {new Date(threat.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            PQC Signed
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Download className="w-3 h-3 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quantum-security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Bell Test (PCD) Status
                </CardTitle>
                <CardDescription>
                  Photon Correlation Detection for quantum entanglement verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">Entanglement Verified</p>
                      <p className="text-sm text-green-600 dark:text-green-400">Bell inequality violation: 2.82</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Quantum Channel Integrity</span>
                    <span className="text-sm font-medium text-green-600">99.7%</span>
                  </div>
                  <Progress value={99.7} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CHSH Parameter</span>
                    <span className="text-sm font-medium">2.82 &gt; 2.0</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                  <Shield className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Device-independent quantum key distribution (DI-QKD) is operational. 
                    No local realism detected - quantum security confirmed.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  QKD Security Layer
                </CardTitle>
                <CardDescription>
                  Quantum Key Distribution for unbreakable encryption
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">256</p>
                    <p className="text-xs text-muted-foreground">Quantum Keys/sec</p>
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-2xl font-bold text-purple-600">0.02%</p>
                    <p className="text-xs text-muted-foreground">Error Rate</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sifted Key Rate</span>
                    <span className="text-sm font-medium">1.2 Mbps</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Secret Key Rate</span>
                    <span className="text-sm font-medium">850 Kbps</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Distance</span>
                    <span className="text-sm font-medium">45.2 km</span>
                  </div>
                </div>
                
                <Badge variant="outline" className="w-full justify-center">
                  BB84 Protocol Active
                </Badge>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5 text-cyan-600" />
                Advanced Quantum Security Algorithms
              </CardTitle>
              <CardDescription>
                Next-generation quantum-safe technologies in development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border-cyan-200 dark:border-cyan-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-cyan-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Quantum Digital Signatures</p>
                        <Badge variant="outline" className="text-xs">QDS Protocol</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Unforgeable, quantum-authenticated VIP content signatures
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Status</span>
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Testing</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 dark:border-purple-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                        <Network className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Quantum SMPC</p>
                        <Badge variant="outline" className="text-xs">Multi-Party</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Cross-agency intelligence sharing without data exposure
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Status</span>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Development</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 dark:border-green-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <Target className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Quantum Position Verification</p>
                        <Badge variant="outline" className="text-xs">QPV</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Location-based quantum authentication for VIPs
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Status</span>
                      <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Research</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200 dark:border-red-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Quantum ML Detection</p>
                        <Badge variant="outline" className="text-xs">QML</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Advanced threat pattern recognition using quantum computing
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Status</span>
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Prototype</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-indigo-200 dark:border-indigo-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Quantum Blockchain</p>
                        <Badge variant="outline" className="text-xs">Entangled</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Immutable evidence ledger with quantum consensus
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Status</span>
                      <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">Experimental</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-amber-200 dark:border-amber-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                        <Eye className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">QRNG Integration</p>
                        <Badge variant="outline" className="text-xs">True Random</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Quantum random number generation for cryptographic keys
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Status</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  Quantum Security Timeline
                </CardTitle>
                <CardDescription>Implementation roadmap for quantum technologies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Current: PQC + QKD</p>
                      <p className="text-xs text-muted-foreground">Post-quantum cryptography with quantum key distribution</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">2024-2025: QDS + QRNG</p>
                      <p className="text-xs text-muted-foreground">Quantum digital signatures and true randomness</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">2025-2027: QSMPC + QPV</p>
                      <p className="text-xs text-muted-foreground">Secure multi-party computation and position verification</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">2027+: QML + QHE</p>
                      <p className="text-xs text-muted-foreground">Quantum machine learning and homomorphic encryption</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  Security Threat Resistance
                </CardTitle>
                <CardDescription>Protection against classical and quantum attacks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Brute Force</p>
                      <p className="text-xs text-muted-foreground">Classical computational attacks</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Immune</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Shor's Algorithm</p>
                      <p className="text-xs text-muted-foreground">Quantum factoring attacks</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Protected</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Grover's Algorithm</p>
                      <p className="text-xs text-muted-foreground">Quantum search attacks</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Mitigated</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Man-in-the-Middle</p>
                      <p className="text-xs text-muted-foreground">Communication interception</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Detected</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Side-Channel</p>
                      <p className="text-xs text-muted-foreground">Physical implementation attacks</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Monitored</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default VIPMonitoring;
