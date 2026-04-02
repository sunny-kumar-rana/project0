package servlets;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@WebServlet("/services")
public class ServiceServlet extends HttpServlet {

    private static final List<Map<String, Object>> services = new ArrayList<>();

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        String user = (String) request.getSession().getAttribute("userEmail");

        if (user == null) {
            response.setStatus(401);
            return;
        }

        String my = request.getParameter("my");

        List<Map<String, Object>> result;

        if ("true".equals(my)) {
            result = services.stream()
                    .filter(s -> s.get("providerId").equals(user))
                    .toList();
        } else {
            result = services;
        }

        response.setContentType("application/json");
        response.getWriter().write(new JSONArray(result).toString());
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        String user = (String) request.getSession().getAttribute("userEmail");

        if (user == null) {
            response.setStatus(401);
            return;
        }

        BufferedReader reader = request.getReader();
        String body = reader.lines().collect(Collectors.joining());

        JSONObject json = new JSONObject(body);

        Map<String, Object> service = new HashMap<>();
        service.put("id", System.currentTimeMillis());
        service.put("providerId", user);
        service.put("title", json.getString("title"));
        service.put("category", json.getString("category"));
        service.put("price", json.getInt("price"));
        service.put("location", json.getString("location"));
        service.put("description", json.getString("description"));

        services.add(service);

        response.setStatus(200);
    }
}
