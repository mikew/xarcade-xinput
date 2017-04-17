using Grapevine.Interfaces.Server;
using Grapevine.Server.Attributes;
using Grapevine.Shared;
using System.Collections.Generic;

namespace XArcade_XInput {
    class RestServer {
        public bool IsRunning = false;
        Grapevine.Server.RestServer _server;
        int Port = 32123;

        public void Start () {
            if (IsRunning) {
                return;
            }

            var appdir = System.AppDomain.CurrentDomain.BaseDirectory;
            var publicPath = System.IO.Path.Combine(new string[] { appdir, "webapp" });

            _server = new Grapevine.Server.RestServer();
            _server.Host = "+";
            _server.Port = Port.ToString();
            _server.PublicFolder = new Grapevine.Server.PublicFolder(publicPath);
            if (Program.IsDebug) {
                _server.LogToConsole();
            }

            _server.Start();
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
                { "isControllerRunning", Program.Manager.IsRunning },
                { "isKeyboardRunning", Program.Mapper.IsRunning },
            });

            return ctx;
        }

        [RestRoute(HttpMethod = HttpMethod.POST, PathInfo = "/api/controller/stop")]
        public IHttpContext ControllerStop (IHttpContext ctx) {
            Program.Manager.Stop();

            RestServer.SetCORSHeaders(ctx);
            RestServer.CloseResponse(ctx);

            return ctx;
        }

        [RestRoute(HttpMethod = HttpMethod.POST, PathInfo = "/api/controller/start")]
        public IHttpContext ControllerStart (IHttpContext ctx) {
            Program.Manager.Start();

            RestServer.SetCORSHeaders(ctx);
            RestServer.CloseResponse(ctx);

            return ctx;
        }

        [RestRoute(HttpMethod = HttpMethod.POST, PathInfo = "/api/keyboard/stop")]
        public IHttpContext KeyboardStop (IHttpContext ctx) {
            Program.Mapper.Stop();

            RestServer.SetCORSHeaders(ctx);
            RestServer.CloseResponse(ctx);

            return ctx;
        }

        [RestRoute(HttpMethod = HttpMethod.POST, PathInfo = "/api/keyboard/start")]
        public IHttpContext KeyboardStart (IHttpContext ctx) {
            Program.Mapper.Start();

            RestServer.SetCORSHeaders(ctx);
            RestServer.CloseResponse(ctx);

            return ctx;
        }

        [RestRoute(HttpMethod = HttpMethod.POST, PathInfo = "/api/keyboard/mapping")]
        public IHttpContext KeyboardSetMapping (IHttpContext ctx) {
            RestServer.SetCORSHeaders(ctx);

            try {
                Program.Mapper.ParseMapping(ctx.Request.Payload);
                var appdir = System.AppDomain.CurrentDomain.BaseDirectory;
                var currentMappingPath = System.IO.Path.Combine(new string[] { appdir, "mappings", "current.json" });
                System.IO.File.WriteAllText(currentMappingPath, ctx.Request.Payload);
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
                { "mapping", Program.Mapper.CurrentMapping },
            });

            return ctx;
        }
    }
}
