using Grapevine.Interfaces.Server;
using Grapevine.Server.Attributes;
using Grapevine.Shared;
using System.Collections.Generic;

namespace XArcade_XInput {
    class RestServer {
        public bool IsRunning = false;
        Grapevine.Server.RestServer _server;
        int Port = 32123;

        public RestServer () {
            var appdir = System.AppDomain.CurrentDomain.BaseDirectory;
            var publicPath = System.IO.Path.Combine(new string[] { appdir, "webapp" });

            _server = new Grapevine.Server.RestServer();
            _server.Host = "+";
            _server.Port = Port.ToString();
            _server.PublicFolder = new Grapevine.Server.PublicFolder(publicPath);
            if (Program.IsDebug) {
                _server.LogToConsole();
            }
        }

        public void Start () {
            if (IsRunning) {
                return;
            }

            _server.Start();

            if (Program.ShouldOpenUI) {
                System.Diagnostics.Process.Start($"http://localhost:{Port}");
            }

            IsRunning = true;
        }

        public void Stop () {
            _server.Stop();
        }

        static public void SetCORSHeaders (IHttpContext ctx) {
            ctx.Response.Headers["Access-Control-Allow-Origin"] = "*";
        }

        static public void SendTextResponse (IHttpContext ctx, string response) {
            ctx.Response.SendResponse(System.Text.Encoding.Default.GetBytes(response));
        }

        static public void CloseResponse (IHttpContext ctx) {
            ctx.Response.Advanced.Close();
        }

        static public void SendJsonResponse (IHttpContext ctx, Dictionary<string, object> jsonObject) {
            ctx.Response.ContentType = ContentType.JSON;
            var ser = new System.Web.Script.Serialization.JavaScriptSerializer();
            SendTextResponse(ctx, ser.Serialize(jsonObject));
        }

        static public Dictionary<string, object> ParseJson (string json) {
            var ser = new System.Web.Script.Serialization.JavaScriptSerializer();
            return ser.DeserializeObject(json) as Dictionary<string, object>;
        }
    }

    [RestResource]
    class DefaultRestResource {
        [RestRoute(HttpMethod = HttpMethod.GET, PathInfo = "/")]
        public IHttpContext Index (IHttpContext ctx) {
            string prefix = ctx.Server.PublicFolder.Prefix;
            if (string.IsNullOrEmpty(prefix)) {
                prefix = "/";
            }
            ctx.Response.Redirect($"{prefix}{ctx.Server.PublicFolder.IndexFileName}");
            RestServer.CloseResponse(ctx);
            return ctx;
        }

        [RestRoute(HttpMethod = HttpMethod.GET, PathInfo = "/api/status")]
        public IHttpContext Status (IHttpContext ctx) {
            RestServer.SetCORSHeaders(ctx);
            RestServer.SendJsonResponse(ctx, new Dictionary<string, object> {
                { "isControllerRunning", Program.ControllerManagerInstance.IsRunning },
                { "isKeyboardRunning", Program.KeyboardMapperInstance.IsRunning },
                { "hostname", System.Net.Dns.GetHostName() },
            });

            return ctx;
        }

        [RestRoute(HttpMethod = HttpMethod.POST, PathInfo = "/api/controller/stop")]
        public IHttpContext ControllerStop (IHttpContext ctx) {
            Program.ControllerManagerInstance.Stop();

            RestServer.SetCORSHeaders(ctx);
            RestServer.CloseResponse(ctx);

            return ctx;
        }

        [RestRoute(HttpMethod = HttpMethod.POST, PathInfo = "/api/controller/start")]
        public IHttpContext ControllerStart (IHttpContext ctx) {
            Program.ControllerManagerInstance.Start();

            RestServer.SetCORSHeaders(ctx);
            RestServer.CloseResponse(ctx);

            return ctx;
        }

        [RestRoute(HttpMethod = HttpMethod.POST, PathInfo = "/api/keyboard/stop")]
        public IHttpContext KeyboardStop (IHttpContext ctx) {
            Program.KeyboardMapperInstance.Stop();

            RestServer.SetCORSHeaders(ctx);
            RestServer.CloseResponse(ctx);

            return ctx;
        }

        [RestRoute(HttpMethod = HttpMethod.POST, PathInfo = "/api/keyboard/start")]
        public IHttpContext KeyboardStart (IHttpContext ctx) {
            Program.KeyboardMapperInstance.Start();

            RestServer.SetCORSHeaders(ctx);
            RestServer.CloseResponse(ctx);

            return ctx;
        }

        [RestRoute(HttpMethod = HttpMethod.POST, PathInfo = "/api/keyboard/mapping")]
        public IHttpContext KeyboardSetMapping (IHttpContext ctx) {
            RestServer.SetCORSHeaders(ctx);

            try {
                var json = RestServer.ParseJson(ctx.Request.Payload);
                Program.KeyboardMapperInstance.SaveMapping((string)json["name"], (string)json["mapping"]);
                RestServer.CloseResponse(ctx);
            } catch (System.Exception e) {
                ctx.Response.StatusCode = HttpStatusCode.InternalServerError;
                RestServer.SendJsonResponse(ctx, new Dictionary<string, object> {
                    { "error", e.Message },
                });
            }

            return ctx;
        }

        [RestRoute(HttpMethod = HttpMethod.GET, PathInfo = "/api/keyboard/mapping")]
        public IHttpContext KeyboardGetMapping (IHttpContext ctx) {
            RestServer.SetCORSHeaders(ctx);
            RestServer.SendJsonResponse(ctx, new Dictionary<string, object> {
                { "currentMapping", Program.KeyboardMapperInstance.CurrentMappingName },
                { "mappings", Program.KeyboardMapperInstance.GetAllMappings() },
            });

            return ctx;
        }

        [RestRoute(HttpMethod = HttpMethod.POST, PathInfo = "/api/keyboard/mapping/current")]
        public IHttpContext KeyboardSetCurrentName (IHttpContext ctx) {
            try {
                Program.KeyboardMapperInstance.SetCurrentMappingName(ctx.Request.Payload);
                RestServer.SetCORSHeaders(ctx);
                RestServer.CloseResponse(ctx);
            } catch (System.Exception e) {
                ctx.Response.StatusCode = HttpStatusCode.InternalServerError;
                RestServer.SendJsonResponse(ctx, new Dictionary<string, object> {
                    { "error", e.Message },
                });
            }


            return ctx;
        }
    }
}
