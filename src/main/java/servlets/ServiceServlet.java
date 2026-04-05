package servlets;

import DBConnectivity.DBConnection;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.PreparedStatement;
import java.util.stream.Collectors;

@WebServlet("/services")
public class ServiceServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        response.setContentType("application/json");

        String user = (String) request.getSession().getAttribute("userEmail");

        if (user == null) {
            response.setStatus(401);
            return;
        }

        try (Connection conn = DBConnection.getConnection()) {

            PreparedStatement ps;

            if ("true".equals(request.getParameter("my"))) {
                ps = conn.prepareStatement(
                        "SELECT * FROM services WHERE provider_email=?"
                );
                ps.setString(1, user);
            } else {
                ps = conn.prepareStatement("SELECT * FROM services");
            }

            ResultSet rs = ps.executeQuery();

            JSONArray arr = new JSONArray();

            while (rs.next()) {
                JSONObject obj = new JSONObject();
                obj.put("id", rs.getLong("id"));
                obj.put("providerId", rs.getString("provider_email"));
                obj.put("title", rs.getString("title"));
                obj.put("category", rs.getString("category"));
                obj.put("price", rs.getInt("price"));
                obj.put("location", rs.getString("location"));
                obj.put("description", rs.getString("description"));

                arr.put(obj);
            }

            response.getWriter().write(arr.toString());

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
        }
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

        try (Connection conn = DBConnection.getConnection()) {

            PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO services VALUES (?, ?, ?, ?, ?, ?, ?)"
            );

            ps.setLong(1, System.currentTimeMillis());
            ps.setString(2, user);
            ps.setString(3, json.getString("title"));
            ps.setString(4, json.getString("category"));
            ps.setInt(5, json.getInt("price"));
            ps.setString(6, json.getString("location"));
            ps.setString(7, json.getString("description"));

            ps.executeUpdate();

            response.setStatus(200);

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
        }
    }
}