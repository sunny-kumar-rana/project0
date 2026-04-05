package servlets;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;

import java.io.BufferedReader;
import DBConnectivity.DBConnection;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.PreparedStatement;
import java.util.stream.Collectors;

@WebServlet("/register")
public class RegisterServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        BufferedReader reader = request.getReader();
        String body = reader.lines().collect(Collectors.joining());

        JSONObject json = new JSONObject(body);

        String email = json.getString("email");
        String password = json.getString("password");
        String role = json.getString("role");

        try (Connection conn = DBConnection.getConnection()) {

            PreparedStatement check = conn.prepareStatement(
                    "SELECT email FROM users WHERE email=?"
            );
            check.setString(1, email);

            ResultSet rs = check.executeQuery();

            if (rs.next()) {
                response.setStatus(409);
                return;
            }

            PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO users VALUES (?, ?, ?)"
            );

            ps.setString(1, email);
            ps.setString(2, password);
            ps.setString(3, role);

            ps.executeUpdate();

            response.setStatus(200);

        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(500);
        }
    }
}
